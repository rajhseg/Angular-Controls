
export class RTreeItem {

  private _level: number = 1;
  private _childItems: RTreeItem[] = [];
  private _loaderItem: boolean = false;

  public Id: string = 'rid' + crypto.randomUUID().replace(/-/g,'');

  public CustomPropertyObject: any | undefined = {};

  public DisplayText: string = "";

  public Value: object | string | number | undefined = undefined;

  public IsExpanded: boolean = false;

  public ImageUrl: string | undefined = undefined;

  public ImageData: string | undefined = undefined;

  public get Childrens(): RTreeItem[] {
    return this._childItems;
  }

  public get IsHaveChild(): boolean {
    return this._childItems.length > 0;
  }

  public get ImageSrc(): string {
    return this.ImageUrl != undefined ? this.ImageUrl : this.ImageData != undefined ? this.ImageData : "";
  }

  public get IsHaveItemImage(): boolean {
    return this.ImageUrl != undefined || this.ImageData != undefined;
  }

  public get Level(): number {

    this.CalculateLevel();

    return this._level;
  }

  public ConvertToLoaderItem() {
    this.DisplayText = "Loading....";
    this._loaderItem = true;
  }

  public IsLoaderItem(): boolean {
    return this._loaderItem;
  }

  public AddChildItems(value: RTreeItem[] | RTreeItem) {

    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        this._childItems.push(value[i]);
      }
    } else {
      this._childItems.push(value);
    }

    this.CalculateLevel();
  }

  public DeleteChildItem(removeItem: RTreeItem) {
    this.RemoveItem(this, removeItem);
  }

  private RemoveItem(parentItem: RTreeItem, removeItem: RTreeItem) {
    var removeIndx = parentItem._childItems.findIndex(x => x.Id == removeItem.Id);
    if (removeIndx == -1 && parentItem._childItems.length > 0) {
      parentItem._childItems.forEach(x => {
        this.RemoveItem(x, removeItem);
      });
    }
    else {
      parentItem._childItems.splice(removeIndx, 1);
    }
  }

  private CalculateLevel() {
    if (this._childItems) {
      for (var i = 0; i < this._childItems.length; i++) {
        this._childItems[i]._level = this._level + 1;
      }
    }
  }

}
