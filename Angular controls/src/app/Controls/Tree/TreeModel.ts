
export class RTreeItem {
    
    public DisplayText : string = "";

    public Value: object | string | number | undefined = undefined;

    public IsExpanded: boolean = false;

    public Childrens: RTreeItem[] = [];

    public ImageUrl: string | undefined = undefined;

    public ImageData: string | undefined = undefined;

    public get IsHaveChild(): boolean {
        return this.Childrens.length > 0;
    }

    public get GetImageSrc() : string {
        return this.ImageUrl != undefined ? this.ImageUrl : this.ImageData != undefined ? this.ImageData : "";
    }

    public get IsHaveItemImage() : boolean {
        return this.ImageUrl != undefined || this.ImageData != undefined;
    }
}