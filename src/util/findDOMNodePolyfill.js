import ReactDOM from 'react-dom';

function walkFiber(fiber) {
    if (!fiber) return null;
    if (fiber.stateNode && fiber.stateNode.nodeType) return fiber.stateNode;
    let node = walkFiber(fiber.child);
    if (node) return node;
    return walkFiber(fiber.sibling);
}

function findDOMNodeShim(instance) {
    if (instance == null) return null;
    if (instance.nodeType) return instance;
    const fiber = instance._reactInternals || instance._reactInternalFiber;
    if (fiber) {
        return walkFiber(fiber);
    }
    return null;
}

if (typeof ReactDOM.findDOMNode !== 'function') {
    try {
        ReactDOM.findDOMNode = findDOMNodeShim;
    } catch {
        // Some bundlers freeze the namespace; ignore so we still export the shim.
    }
}

export default findDOMNodeShim;
