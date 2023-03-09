export type Container = Element;
export type Instance = Element;

export const createInstance = (type: string, props: any): Instance => {

  console.log(props);

  const element = document.createElement(type);

  return element
};

export const appendInitialChilld = (parent: Instance, child: Instance): void => {
  parent.appendChild(child)
};

export const createTextInitialChilld = (content: string) => {
  return document.createTextNode(content)
};

export const appendChildToContainer = appendInitialChilld
