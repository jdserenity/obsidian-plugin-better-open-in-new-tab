import { App, Plugin, WorkspaceLeaf } from 'obsidian';

declare module 'obsidian' {
  interface App {
    commands: {
      executeCommandById(id: string): void;
    };
  }
}

export default class OpenNewTabAndQuickSwitcher extends Plugin {
  async onload() {
    this.addCommand({
      id: 'open-new-tab-and-quick-switcher',
      name: 'Better Open in New Tab',
      hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'U' }],
      callback: () => {
        const leaf = this.createNewLeafAfterLastPinned();
        this.app.workspace.setActiveLeaf(leaf);
        this.app.commands.executeCommandById('switcher:open');
      }
    });
  }

  createNewLeafAfterLastPinned(): WorkspaceLeaf {
    const leaves = this.app.workspace.getLeavesOfType('markdown');
    const pinnedLeaves = leaves.filter(leaf => leaf.view.getState().pinned);

    if (pinnedLeaves.length === 0) {
      // No pinned tabs, open a new tab at the end
      return this.app.workspace.getLeaf(true);
    }

    const lastPinnedLeaf = pinnedLeaves[pinnedLeaves.length - 1];
    const parent = lastPinnedLeaf.parent;

    // Create a new leaf right after the last pinned leaf
    const newLeaf = this.app.workspace.createLeafInParent(
      parent,
      (parent as any).children?.indexOf(lastPinnedLeaf) + 1 || 0
    );

    return newLeaf;
  }
}