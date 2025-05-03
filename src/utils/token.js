export function getClientIdFromToken(token) {
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.sub; // backend에서 setSubject(clientId) 한 값
    } catch (e) {
      console.error('토큰 파싱 실패:', e);
      return null;
    }
  }
  
  export function getRoleFromToken(token) {
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.role;
    } catch (e) {
      console.error('토큰 파싱 실패:', e);
      return null;
    }
  }
  