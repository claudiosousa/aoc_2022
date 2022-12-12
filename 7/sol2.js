import { assert } from 'console';
import { promises as fs } from 'fs';

const cmds = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .reduce((acc, l) => {
    if (l.startsWith('$ ')) {
      acc.push([l.substring(2), []]);
    } else {
      acc[acc.length - 1][1].push(l);
    }
    return acc;
  }, []);

class Tree {
  constructor() {
    this.children = {};
    this.localsize = 0;
  }

  getChildren() {
    return this.children;
  }

  getFullSize() {
    return (
      this.localsize +
      Object.entries(this.children).reduce(
        (sum, [path, node]) => sum + node.getFullSize(),
        0
      )
    );
  }

  navigateToChild(dir) {
    if (!(dir in this.children)) this.children[dir] = new TreeNode(this, dir);
    return this.children[dir];
  }

  setFilesSize(size) {
    this.localsize = size;
  }

  navigateToParent() {
    return this.parent;
  }
}

class TreeNode extends Tree {
  constructor(parent, name) {
    super();
    this.parent = parent;
    this.name = name;
  }
}

let tree = new Tree();
let curr_node = tree;

cmds.forEach(([cmd, res]) => {
  if (cmd == 'cd /') curr_node = tree;
  else if (cmd == 'cd ..') curr_node = curr_node.navigateToParent();
  else if (cmd.startsWith('cd '))
    curr_node = curr_node.navigateToChild(cmd.substring(3));
  else if (cmd == 'ls') {
    curr_node.setFilesSize(
      res
        .filter(([cmd]) => cmd.match(/^[0-9]+/))
        .map(f => parseInt(f.match(/^[0-9]+/)))
        .reduce((s, v) => s + v, 0)
    );
  } else throw 'Unknow cmd ' + cmd;
});

const max_space_occupied = 40000000;
const occupiedSize = tree.getFullSize();
assert(occupiedSize > max_space_occupied);
let size_to_free_up = occupiedSize - max_space_occupied;
let min_folder_size_to_remove = occupiedSize;

let findFolderSizeToRemove = node => {
  if (
    node.getFullSize() >= size_to_free_up &&
    min_folder_size_to_remove > node.getFullSize()
  )
    min_folder_size_to_remove = node.getFullSize();
  Object.entries(node.getChildren()).forEach(([name, child]) =>
    findFolderSizeToRemove(child)
  );
};
findFolderSizeToRemove(tree);

console.log(min_folder_size_to_remove);
