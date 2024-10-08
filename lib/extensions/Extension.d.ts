import { Editor, EditorCommandsType, KNode, KNodeMarksType, KNodeStylesType, RuleFunctionType, Selection } from '../model';
/**
 * 创建插件的入参类型
 */
export type ExtensionCreateOptionType = {
    /**
     * 插件名称
     */
    name: string;
    /**
     * 额外保留的标签
     */
    extraKeepTags?: string[];
    /**
     * 自定义格式化规则
     */
    formatRule?: RuleFunctionType;
    /**
     * 自定义dom转为非文本节点的后续处理
     */
    domParseNodeCallback?: (this: Editor, node: KNode) => KNode;
    /**
     * 节点粘贴保留标记的自定义方法
     */
    pasteKeepMarks?: (this: Editor, node: KNode) => KNodeMarksType;
    /**
     * 节点粘贴保留样式的自定义方法
     */
    pasteKeepStyles?: (this: Editor, node: KNode) => KNodeStylesType;
    /**
     * 视图更新后回调
     */
    afterUpdateView?: (this: Editor) => void;
    /**
     * 光标变化回调
     */
    onSelectionUpdate?: (this: Editor, selection: Selection) => void;
    /**
     * 自定义命令
     */
    addCommands?: (this: Editor) => EditorCommandsType;
};
/**
 * 插件
 */
export declare class Extension {
    /**
     * 插件名称
     */
    name: string;
    /**
     * 是否已注册
     */
    registered: boolean;
    /**
     * 额外保留的标签
     */
    extraKeepTags: string[];
    /**
     * 自定义格式化规则
     */
    formatRule?: RuleFunctionType;
    /**
     * 自定义dom转为非文本节点的后续处理
     */
    domParseNodeCallback?: (this: Editor, node: KNode) => KNode;
    /**
     * 节点粘贴保留标记的自定义方法
     */
    pasteKeepMarks?: (this: Editor, node: KNode) => KNodeMarksType;
    /**
     * 节点粘贴保留样式的自定义方法
     */
    pasteKeepStyles?: (this: Editor, node: KNode) => KNodeStylesType;
    /**
     * 视图更新后回调
     */
    afterUpdateView?: (this: Editor) => void;
    /**
     * 光标变化回调
     */
    onSelectionUpdate?: (this: Editor, selection: Selection) => void;
    /**
     * 自定义命令
     */
    addCommands?: (this: Editor) => EditorCommandsType;
    constructor(name: string);
    /**
     * 创建插件
     */
    static create(options: ExtensionCreateOptionType): Extension;
}
