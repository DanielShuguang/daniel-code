export namespace filesystem {
	
	export class DirTree {
	    name: string;
	    path: string;
	    isDir: boolean;
	    type: string;
	    hasChildren: boolean;
	    children?: DirTree[];
	
	    static createFrom(source: any = {}) {
	        return new DirTree(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.isDir = source["isDir"];
	        this.type = source["type"];
	        this.hasChildren = source["hasChildren"];
	        this.children = this.convertValues(source["children"], DirTree);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class FileContentResult {
	    content?: string;
	    message?: string;
	    isBinary: boolean;
	
	    static createFrom(source: any = {}) {
	        return new FileContentResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.content = source["content"];
	        this.message = source["message"];
	        this.isBinary = source["isBinary"];
	    }
	}
	export class FileDetails {
	    name: string;
	    path: string;
	    content: string;
	    message?: string;
	    isBinary: boolean;
	    type?: string;
	
	    static createFrom(source: any = {}) {
	        return new FileDetails(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.content = source["content"];
	        this.message = source["message"];
	        this.isBinary = source["isBinary"];
	        this.type = source["type"];
	    }
	}
	export class FileTreeResult {
	    message?: string;
	    data?: DirTree;
	
	    static createFrom(source: any = {}) {
	        return new FileTreeResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.message = source["message"];
	        this.data = this.convertValues(source["data"], DirTree);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

