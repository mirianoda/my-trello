export interface Boards {
  [id: string]: {
    id: string;
    title: string;
    lists: string[];
  };
}

export interface Lists {
  [id: string]: {
    id: string;
    title: string;
    cards: string[];
  };
}

export interface Cards {
  [id: string]: {
    id: string;
    title: string;
  };
}
