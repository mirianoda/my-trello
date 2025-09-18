export interface Session {
  currentBoardId: string;
}

export interface User {
  user: null | {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
  };
}
