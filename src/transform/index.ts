import * as LINE from "../types/LINE";

export default abstract class Transform {
  public abstract json(ev: LINE.Event): Promise<any>;
}
