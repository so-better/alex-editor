import Util from './Util'

class AlexElement {
	constructor(type, parsedom, marks, styles, children, textContent) {
		//key值
		this.key = Util.getUniqueKey()
		//类型 block/inline/text/closed
		this.type = type
		//真实节点名称
		this.parsedom = parsedom
		//标记集合
		this.marks = marks
		//样式集合
		this.styles = styles
		//子元素
		this.children = children
		//text时的值
		this.textContent = textContent
		//父元素
		this.parent = null
		//真实dom
		this._elm = null
	}
	//是否文本
	isText() {
		return this.type == 'text'
	}
	//是否块
	isBlock() {
		return this.type == 'block'
	}
	//是否行内
	isInline() {
		return this.type == 'inline'
	}
	//是否闭合
	isClosed() {
		return this.type == 'closed'
	}
	//是否换行符
	isBreak() {
		return this.isClosed() && this.parsedom == 'br'
	}
	//是否空
	isEmpty() {
		//文本节点没有值认为是空
		if (this.isText() && !this.textContent) {
			return true
		}
		//行内和块元素
		if (this.isInline() || this.isBlock()) {
			if (!this.hasChildren()) {
				return true
			}
			const allEmpty = this.children.every(el => {
				return !el || el.isEmpty()
			})
			return allEmpty
		}
		return false
	}
	//是否根元素
	isRoot() {
		return !this.parent
	}
	//是否包含指定节点
	isContains(element) {
		if (this.isEqual(element)) {
			return true
		}
		if (element.isRoot()) {
			return false
		}
		return this.isContains(element.parent)
	}
	//判断两个Element是否相等
	isEqual(element) {
		if (!AlexElement.isElement(element)) {
			return false
		}
		return this.key == element.key
	}
	//判断两个元素是否有包含关系
	hasContains(element) {
		if (!AlexElement.isElement(element)) {
			return false
		}
		return this.isContains(element) || element.isContains(this)
	}
	//是否含有标记
	hasMarks() {
		if (!this.marks) {
			return false
		}
		if (Util.isObject) {
			return !Util.isEmptyObject(this.marks)
		}
		return false
	}
	//是否含有样式
	hasStyles() {
		if (!this.styles) {
			return false
		}
		if (Util.isObject) {
			return !Util.isEmptyObject(this.styles)
		}
		return false
	}
	//是否有子元素
	hasChildren() {
		if (Array.isArray(this.children)) {
			return !!this.children.length
		}
		return false
	}
	//克隆当前元素,deep为true表示深度克隆
	clone(deep = true) {
		if (typeof deep != 'boolean') {
			throw new Error('The parameter must be a Boolean')
		}
		let el = new AlexElement(this.type, this.parsedom, this.marks, this.styles, null, this.textContent)
		if (deep && this.hasChildren()) {
			this.children.forEach(child => {
				let clonedChild = child.clone(deep)
				if (el.hasChildren()) {
					el.children.push(clonedChild)
				} else {
					el.children = [clonedChild]
				}
				clonedChild.parent = el
			})
		}
		return el
	}
	//渲染成真实dom
	renderElement() {
		let el = null
		//文本节点
		if (this.isText()) {
			el = document.createTextNode(this.textContent)
		}
		//非文本节点
		else {
			el = document.createElement(this.parsedom)
			//设置属性
			if (this.hasMarks()) {
				for (let key in this.marks) {
					//过滤掉事件、样式
					if (!/^on/g.test(key) && key != 'style') {
						el.setAttribute(key, this.marks[key])
					}
				}
			}
			//设置样式
			if (this.hasStyles()) {
				for (let key in this.styles) {
					el.style.setProperty(key, this.styles[key])
				}
			}
			//渲染子元素
			if (this.hasChildren()) {
				for (let child of this.children) {
					let childElm = child.renderElement()
					el.appendChild(childElm)
				}
			}
		}
		//设置唯一key标记
		Util.setData(el, 'data-alex-editor-key', this.key)
		//更新挂载的真实dom
		this._elm = el
		return el
	}
	//转换成block元素
	convertToBlock() {
		if (this.isBlock()) {
			throw new Error('This element is already of type "block"')
		}
		let element = this.clone(true)
		if (this.isText()) {
			this.textContent = null
		}
		this.type = 'block'
		this.parsedom = AlexElement.paragraph
		this.marks = null
		this.styles = null
		this.children = [element]
		element.parent = this
	}
	//定义段落标签
	static paragraph = 'p'
	//判断是否该类型数据
	static isElement(val) {
		return val instanceof AlexElement
	}
	//扁平化处理元素数组
	static flatElements(elements) {
		const flat = arr => {
			let result = []
			arr.forEach(element => {
				result.push(element)
				if (element.hasChildren()) {
					let arr = flat(element.children)
					result = [...result, ...arr]
				}
			})
			return result
		}
		return flat(elements)
	}
	//内部定义的转换规则，可以被renderRules属性覆盖
	static _renderRules(element) {
		switch (element.parsedom) {
			case 'br':
				element.type = 'closed'
				element.children = null
				break
			case 'span':
				element.type = 'inline'
				break
			case 'img':
				element.type = 'closed'
				element.children = null
				break
			case 'input':
				element.type = 'inline'
				element.parsedom = 'span'
				break
			default:
				break
		}
		return element
	}
	//校验函数数组，用于格式化
	static _formatUnchangeableRules = [
		//移除节点规则
		function (element) {
			//空节点移除
			if (element.isEmpty()) {
				element = null
			}
			return element
		},
		//子元素中换行符和非换行符元素不可同时存在
		function (element) {
			if (element.hasChildren()) {
				//是否有换行符
				let hasBreak = element.children.some(el => {
					if (el) {
						return el.isBreak()
					}
					return false
				})
				//是否有其他元素
				let hasOther = element.children.some(el => {
					if (el) {
						return !el.isBreak()
					}
					return false
				})
				//既有换行符也有其他元素则把换行符元素都置为null
				if (hasBreak && hasOther) {
					element.children = element.children.map(el => {
						if (el && el.isBreak()) {
							return null
						}
						return el
					})
				}
				//只有换行符且不止一个
				else if (hasBreak && element.children.length > 1) {
					element.children = [element.children[0]]
				}
			}
			return element
		},
		//同级元素如果存在block，则其他元素也必须是block
		function (element) {
			if (element.hasChildren()) {
				let hasBlock = element.children.some(el => {
					if (el) {
						return el.isBlock()
					}
					return false
				})
				if (hasBlock) {
					element.children.forEach(el => {
						if (el && !el.isBlock()) {
							el.convertToBlock()
						}
					})
				}
			}
			return element
		}
	]
}

export default AlexElement