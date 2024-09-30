import { Editor } from '../Editor';
import { KNode } from '../KNode';
import { RuleFunctionType } from './format-rules';
import { Extension } from '../../extensions';
/**
 * 获取选区内的可聚焦节点所在的块节点数组
 */
export declare const getSelectionBlockNodes: (this: Editor) => KNode[];
/**
 * 打散指定的节点，将其分裂成多个节点，如果子孙节点还有子节点则继续打散
 */
export declare const splitNodeToNodes: (this: Editor, node: KNode) => void;
/**
 * 清空固定块节点的内容
 */
export declare const emptyFixedBlock: (this: Editor, node: KNode) => void;
/**
 * 该方法目前只为delete方法内部使用：将后一个块节点与前一个块节点合并
 */
export declare const mergeBlock: (this: Editor, node: KNode, target: KNode) => void;
/**
 * 判断编辑器内的指定节点是否可以进行合并操作，parent表示和父节点进行合并，prevSibling表示和前一个兄弟节点进行合并，nextSibling表示和下一个兄弟节点合并，如果可以返回合并的对象节点
 */
export declare const getAllowMergeNode: (this: Editor, node: KNode, type: "parent" | "prevSibling" | "nextSibling") => KNode | null;
/**
 * 对编辑器内的某个节点执行合并操作，parent表示和父节点进行合并，prevSibling表示和前一个兄弟节点进行合并，nextSibling表示和下一个兄弟节点合并（可能会更新光标）
 */
export declare const applyMergeNode: (this: Editor, node: KNode, type: "parent" | "prevSibling" | "nextSibling") => void;
/**
 * 将编辑器内的某个非块级节点转为默认块级节点
 */
export declare const convertToBlock: (this: Editor, node: KNode) => void;
/**
 * 对节点数组使用指定规则进行格式化
 */
export declare const formatNodes: (this: Editor, rule: RuleFunctionType, nodes: KNode[]) => void;
/**
 * 注册插件
 */
export declare const registerExtension: (this: Editor, extension: Extension) => void;
/**
 * 根据真实光标更新selection，返回布尔值表示是否更新成功
 */
export declare const updateSelection: (this: Editor) => boolean;
/**
 * 纠正光标位置，返回布尔值表示是否存在纠正行为
 */
export declare const redressSelection: (this: Editor) => boolean;
/**
 * 初始化校验编辑器的节点数组，如果编辑器的节点数组为空或者都是空节点，则初始化创建一个只有占位符的段落
 */
export declare const checkNodes: (this: Editor) => void;
/**
 * 粘贴时对非文本节点的标记和样式的保留处理
 */
export declare const handlerForPasteKeepMarksAndStyles: (this: Editor, nodes: KNode[]) => void;
/**
 * 粘贴处理
 */
export declare const handlerForPasteDrop: (this: Editor, dataTransfer: DataTransfer) => Promise<void>;