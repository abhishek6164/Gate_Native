import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper for AsyncStorage with graceful error handling
 */

let isInitialized = false;
let initPromise = null;
let asyncStorageAvailable = true;

const initializeStorage = async () => {
    if (isInitialized) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            console.log('[Storage] Initializing AsyncStorage...');

            // Test if AsyncStorage is working
            try {
                await AsyncStorage.setItem('__INIT_TEST__', 'true');
                await AsyncStorage.removeItem('__INIT_TEST__');
                console.log('[Storage] AsyncStorage initialized successfully');
                asyncStorageAvailable = true;
            } catch (testError) {
                // AsyncStorage test failed, but we'll try to use it anyway
                console.warn('[Storage] AsyncStorage test failed:', testError.message);
                asyncStorageAvailable = true; // Still try to use it
            }

            isInitialized = true;
        } catch (error) {
            console.error('[Storage] Initialization error:', error.message);
            asyncStorageAvailable = false;
            isInitialized = true;
        }
    })();

    return initPromise;
};

export const setItem = async (key, value, maxRetries = 5) => {
    try {
        await initializeStorage();

        if (!asyncStorageAvailable) {
            console.warn(`[Storage] AsyncStorage not available, skipping setItem for "${key}"`);
            return;
        }

        console.log(`[Storage] Setting item: ${key}`);

        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await AsyncStorage.setItem(key, value);
                console.log(`[Storage] Successfully saved "${key}" on attempt ${attempt}`);
                return;
            } catch (error) {
                lastError = error;
                console.warn(
                    `[Storage] Attempt ${attempt}/${maxRetries} failed for "${key}": ${error.message}`
                );

                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt - 1) * 100;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        console.error(`[Storage] Failed to save "${key}" after ${maxRetries} attempts`);
        return;
    } catch (error) {
        console.error(`[Storage] setItem error for key "${key}":`, error);
        return;
    }
};

export const getItem = async (key) => {
    try {
        await initializeStorage();

        if (!asyncStorageAvailable) {
            console.warn(`[Storage] AsyncStorage not available, cannot retrieve "${key}"`);
            return null;
        }

        const value = await AsyncStorage.getItem(key);
        console.log(`[Storage] Retrieved "${key}": ${value ? 'found' : 'not found'}`);
        return value;
    } catch (error) {
        console.error(`[Storage] getItem error for key "${key}":`, error);
        return null;
    }
};

export const removeItem = async (key) => {
    try {
        await initializeStorage();

        if (!asyncStorageAvailable) {
            console.warn(`[Storage] AsyncStorage not available, cannot remove "${key}"`);
            return;
        }

        await AsyncStorage.removeItem(key);
        console.log(`[Storage] Removed "${key}"`);
    } catch (error) {
        console.error(`[Storage] removeItem error for key "${key}":`, error);
        return;
    }
};

export const multiSet = async (items) => {
    try {
        await initializeStorage();

        if (!asyncStorageAvailable) {
            console.warn('[Storage] AsyncStorage not available, skipping multiSet');
            return;
        }

        console.log(`[Storage] Setting ${items.length} items`);
        await AsyncStorage.multiSet(items);
        console.log('[Storage] Successfully saved all items');
    } catch (error) {
        console.error('[Storage] multiSet error:', error);
        return;
    }
};

export const clear = async () => {
    try {
        await initializeStorage();

        if (!asyncStorageAvailable) {
            console.warn('[Storage] AsyncStorage not available, skipping clear');
            return;
        }

        await AsyncStorage.clear();
        console.log('[Storage] Cleared all storage');
    } catch (error) {
        console.error('[Storage] clear error:', error);
        return;
    }
};

export const getAllKeys = async () => {
    try {
        await initializeStorage();

        if (!asyncStorageAvailable) {
            console.warn('[Storage] AsyncStorage not available, cannot get keys');
            return [];
        }

        const keys = await AsyncStorage.getAllKeys();
        console.log('[Storage] Available keys:', keys);
        return keys;
    } catch (error) {
        console.error('[Storage] getAllKeys error:', error);
        return [];
    }
};

export default {
    setItem,
    getItem,
    removeItem,
    multiSet,
    clear,
    getAllKeys,
    initialize: initializeStorage,
};