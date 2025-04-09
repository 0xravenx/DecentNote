import { create } from 'ipfs-http-client';

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + btoa(process.env.REACT_APP_IPFS_PROJECT_ID + ':' + process.env.REACT_APP_IPFS_SECRET),
  },
});

export const uploadToIPFS = async (content) => {
  try {
    const encrypted = await encryptContent(content);
    const result = await ipfs.add(encrypted);
    return result.path;
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw error;
  }
};

export const getFromIPFS = async (hash) => {
  try {
    const stream = ipfs.cat(hash);
    let data = '';

    for await (const chunk of stream) {
      data += new TextDecoder().decode(chunk);
    }

    return await decryptContent(data);
  } catch (error) {
    console.error('IPFS retrieval failed:', error);
    throw error;
  }
};

const encryptContent = async (content) => {
  // Simple base64 encoding for now, will add proper encryption later
  return btoa(JSON.stringify({
    content,
    timestamp: Date.now(),
  }));
};

const decryptContent = async (encryptedContent) => {
  try {
    const decoded = JSON.parse(atob(encryptedContent));
    return decoded.content;
  } catch (error) {
    return encryptedContent;
  }
};