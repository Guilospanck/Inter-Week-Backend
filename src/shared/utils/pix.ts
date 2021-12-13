
type PixKeyDecoded = {
  requestingUserId: string,
  value: string,
  pixTransactionId: string
}

export const PixEncodeDecodeUtils = () => {
  const encode = (requestingUserId: string, value: number, pixTransactionId: string): string => {
    return `${requestingUserId}-${value.toString()}-${pixTransactionId}`;
  }

  const decode = (pixKeyEncoded: string): PixKeyDecoded => {
    const [requestingUserId, value, pixTransactionId] = pixKeyEncoded.split('-');

    return {
      requestingUserId,
      value,
      pixTransactionId
    };
  }

  return {
    encode,
    decode
  };

}