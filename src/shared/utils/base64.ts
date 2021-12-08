interface IBase64Util {
  encode: (data: any) => string
  decode: (word: string) => {} | string
}

export const Base64Util = (): IBase64Util => {
  const encodeBuffer = (buffer: Buffer) => buffer.toString('base64');
  const encodeString = (word: string) => encodeBuffer(Buffer.from(word));
  const encodeData = (data: any) => encodeString(JSON.stringify(data));
  
  const encode = (data: any) => {
    if (Buffer.isBuffer(data)) return encodeBuffer(data);
    if (typeof data === 'string') return encodeString(data);
  
    return encodeData(data);
  };
  
  const decode = (word: string) => {
    const decoded = Buffer.from(word, 'base64').toString();
  
    try {
      return JSON.parse(decoded);
    } catch (e) {
      return decoded;
    }
  };

  return {
    encode,
    decode
  };

};