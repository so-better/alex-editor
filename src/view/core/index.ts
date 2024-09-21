import { common as DapCommon } from 'dap-util'
import { Editor } from '../../model/Editor'
import { KNode, KNodeMarksType, KNodeStylesType } from '../../model/KNode'

/**
 * 渲染参数类型
 */
export type KNodeRenderOptionsType = {
	tag: string
	attrs: KNodeMarksType
	styles: KNodeStylesType
	namespace?: string
	textContent?: string
	children?: KNodeRenderOptionsType[]
}

/**
 * 节点渲染成dom后在dom上生成的一个特殊标记名称，它的值是节点的key值
 */
export const NODE_MARK = 'data-kaitify-node'

/**
 * 获取节点的渲染参数
 */
export const getNodeRenderOptions = (editor: Editor, node: KNode): KNodeRenderOptionsType => {
	//文本节点
	if (node.isText()) {
		return {
			tag: editor.textRenderTag,
			namespace: node.namespace,
			attrs: node.hasMarks() ? DapCommon.clone({ ...node.marks, [NODE_MARK]: node.key }) : { [NODE_MARK]: node.key },
			styles: node.hasStyles() ? DapCommon.clone(node.styles) : {},
			textContent: node.textContent
		}
	}
	//其他节点
	return {
		tag: node.tag!,
		namespace: node.namespace,
		attrs: node.hasMarks() ? DapCommon.clone({ ...node.marks, [NODE_MARK]: node.key }) : { [NODE_MARK]: node.key },
		styles: node.hasStyles() ? DapCommon.clone(node.styles) : {},
		children: node.hasChildren() ? node.children!.map(item => getNodeRenderOptions(editor, item)) : []
	}
}