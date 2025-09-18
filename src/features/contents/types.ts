export interface Boards {
  [id: string]: {
    id: string;
    title: string;
    ownerId: string;
    members: string[];
    createdAt: string;
    lists: string[];
  };
}

export interface Lists {
  [id: string]: {
    id: string;
    title: string;
    boardId: string;
    order: number;
    cards: string[];
  };
}

export interface Cards {
  [id: string]: {
    id: string;
    title: string;
    listId: string;
    order: number;
  };
}
