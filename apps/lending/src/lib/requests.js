import {
    collection,
    addDoc,
    serverTimestamp,
    runTransaction,
    doc,
    getDoc
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Creates a new lend request.
 */
export async function createLendRequest({ userInfo, items, message }) {
    try {
        const requestData = {
            requested_by_uid: userInfo.uid,
            user_name: userInfo.displayName || userInfo.email,
            admission_no: userInfo.admission_no || null,
            student_class: userInfo.student_class || null,
            user_phone: userInfo.phone || null,
            user_email: userInfo.email,
            items: items.map(item => ({
                device_id: item.id,
                device_name: item.name,
                quantity: item.quantity
            })),
            message: message || "",
            status: "Pending",
            created_at: serverTimestamp(),
            admin_id: null,
            pickup_date: null
        };

        const docRef = await addDoc(collection(db, "lendRequests"), requestData);
        return { id: docRef.id, ...requestData };
    } catch (error) {
        console.error("Error creating lend request:", error);
        throw error;
    }
}

/**
 * Accepts a lend request transactionally.
 */
export async function acceptRequest(requestId, adminUid, pickupDate, expectedReturnDate) {
    try {
        await runTransaction(db, async (transaction) => {
            // READ 1: Get the request document
            const requestRef = doc(db, "lendRequests", requestId);
            const requestDoc = await transaction.get(requestRef);

            if (!requestDoc.exists()) {
                throw "Request does not exist!";
            }

            const requestData = requestDoc.data();
            if (requestData.status !== "Pending") {
                throw "Request is not in Pending state.";
            }

            // READ 2: Get all device documents
            const deviceReads = [];
            const deviceRefs = [];

            for (const item of requestData.items) {
                const deviceRef = doc(db, "devices", item.device_id);
                deviceRefs.push({ ref: deviceRef, item: item }); // Store ref and item metadata
                deviceReads.push(transaction.get(deviceRef));
            }

            const deviceDocs = await Promise.all(deviceReads);

            // LOGIC CHECK: Stock availability
            // We need to map the results back to the items to check stock
            const devicesToUpdate = [];

            for (let i = 0; i < deviceDocs.length; i++) {
                const deviceDoc = deviceDocs[i];
                const { item, ref } = deviceRefs[i];

                if (!deviceDoc.exists()) {
                    throw `Device ${item.device_name} not found.`;
                }

                const deviceData = deviceDoc.data();
                if (deviceData.available_stock < item.quantity) {
                    throw `Insufficient stock for ${item.device_name}. Available: ${deviceData.available_stock}`;
                }

                // Prepare write data
                devicesToUpdate.push({
                    ref: ref,
                    newStock: deviceData.available_stock - item.quantity
                });
            }

            // --- ALL READS COMPLETE, START WRITES ---

            // WRITE 1: Update device stocks
            for (const update of devicesToUpdate) {
                transaction.update(update.ref, {
                    available_stock: update.newStock
                });
            }

            // WRITE 2: Create Borrow Log
            const borrowLogRef = doc(collection(db, "borrowLogs"));
            transaction.set(borrowLogRef, {
                request_id: requestId,
                user_name: requestData.user_name,
                admission_no: requestData.admission_no,
                student_class: requestData.student_class,
                user_phone: requestData.user_phone,
                user_email: requestData.user_email,
                items: requestData.items,
                date_borrowed: serverTimestamp(),
                expected_return_date: expectedReturnDate, // Should be a Date object or Timestamp
                date_returned: null,
                status: "Borrowed",
                admin_id: adminUid,
                returned_by: null
            });

            // WRITE 3: Update Request
            transaction.update(requestRef, {
                status: "Accepted",
                admin_id: adminUid,
                pickup_date: pickupDate
            });
        });
        return { success: true };
    } catch (error) {
        console.error("Transaction failed: ", error);
        throw error;
    }
}

/**
 * Manually lends items without a prior request.
 */
export async function manualLend(adminUid, userInfo, items, expectedReturnDate) {
    try {
        await runTransaction(db, async (transaction) => {
            // READ PHASE: Gather all device data
            const deviceReads = [];
            const deviceContexts = [];

            for (const item of items) {
                const deviceRef = doc(db, "devices", item.id);
                deviceReads.push(transaction.get(deviceRef));
                deviceContexts.push({ ref: deviceRef, item });
            }

            const deviceDocs = await Promise.all(deviceReads);

            // LOGIC PHASE: Check stock and prepare updates
            const updates = [];

            for (let i = 0; i < deviceDocs.length; i++) {
                const deviceDoc = deviceDocs[i];
                const { item, ref } = deviceContexts[i];

                if (!deviceDoc.exists()) {
                    throw `Device ${item.name} not found.`;
                }

                const deviceData = deviceDoc.data();
                if (deviceData.available_stock < item.quantity) {
                    throw `Insufficient stock for ${item.name}. Available: ${deviceData.available_stock}`;
                }

                updates.push({
                    ref: ref,
                    newStock: deviceData.available_stock - item.quantity
                });
            }

            // WRITE PHASE: Perform all updates
            for (const update of updates) {
                transaction.update(update.ref, {
                    available_stock: update.newStock
                });
            }

            // Create Borrow Log
            const borrowLogRef = doc(collection(db, "borrowLogs"));
            transaction.set(borrowLogRef, {
                request_id: null,
                user_name: userInfo.name,
                admission_no: userInfo.admission_no,
                student_class: userInfo.student_class,
                user_phone: userInfo.phone,
                user_email: userInfo.email,
                items: items.map(item => ({
                    device_id: item.id,
                    device_name: item.name,
                    quantity: item.quantity
                })),
                date_borrowed: serverTimestamp(),
                expected_return_date: expectedReturnDate,
                date_returned: null,
                status: "Borrowed",
                admin_id: adminUid,
                returned_by: null
            });
        });
        return { success: true };
    } catch (error) {
        console.error("Manual lend failed: ", error);
        throw error;
    }
}

/**
 * Marks items as returned.
 */
export async function markReturned(logId, returnedItems, returnedByUid, fineAmount = 0) {
    try {
        await runTransaction(db, async (transaction) => {
            // READ 1: Get the borrow log
            const logRef = doc(db, "borrowLogs", logId);
            const logDoc = await transaction.get(logRef);

            if (!logDoc.exists()) {
                throw "Borrow log not found.";
            }

            // READ 2: Get all device documents
            const deviceReads = [];
            const deviceContexts = [];

            for (const item of returnedItems) {
                const deviceRef = doc(db, "devices", item.device_id);
                deviceReads.push(transaction.get(deviceRef));
                deviceContexts.push({ ref: deviceRef, item });
            }

            const deviceDocs = await Promise.all(deviceReads);

            // LOGIC PHASE: Prepare stock updates
            const updates = [];

            for (let i = 0; i < deviceDocs.length; i++) {
                const deviceDoc = deviceDocs[i];
                const { ref, item } = deviceContexts[i];

                if (deviceDoc.exists()) {
                    const deviceData = deviceDoc.data();
                    updates.push({
                        ref: ref,
                        newStock: deviceData.available_stock + item.quantity
                    });
                }
            }

            // WRITE PHASE: Perform all updates
            // 1. Update device stocks
            for (const update of updates) {
                transaction.update(update.ref, {
                    available_stock: update.newStock
                });
            }

            // 2. Update Log
            transaction.update(logRef, {
                status: "Returned",
                date_returned: serverTimestamp(),
                returned_by: returnedByUid,
                fine_amount: fineAmount
            });
        });
        return { success: true };
    } catch (error) {
        console.error("Return transaction failed: ", error);
        throw error;
    }
}
