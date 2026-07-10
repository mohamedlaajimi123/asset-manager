export interface StorageQuotaContext {
  storageUsed: number;
  storageLimit: number;
  incomingBytes: number;
}

export const canAcceptUpload = ({ storageUsed, storageLimit, incomingBytes }: StorageQuotaContext) => {
  if (incomingBytes <= 0) return true;
  return storageUsed + incomingBytes <= storageLimit;
};

export const getStorageUsagePercent = (storageUsed: number, storageLimit: number) => {
  if (!storageLimit || storageLimit <= 0) return 0;
  return Math.min(100, Math.round((storageUsed / storageLimit) * 100));
};
