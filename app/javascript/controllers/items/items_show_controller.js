// item_controller.js
import { Controller } from "stimulus"
import debounce from "lodash/debounce"

export default class extends Controller {
  static targets = [ "content" ]

  connect() {
    this.save = debounce(this.save, 1000) // Debounce the save method
    this.currentParentId = null // Keep track of the current parent
  }

  createOnEnter(event) {
    // Check if the 'Enter' key was pressed
    if (event.keyCode === 13) {
      event.preventDefault() // Prevent the default action to avoid new line

      // Save the current item and create a new one
      this.save()
      this.createNewItem()
    }
  }

  createNewItem() {
    // Determine the parent ID from the current context
    const parentElement = this.contentTarget.closest('[data-item-id]');
    const parentId = parentElement.dataset.itemId;

    // Logic to create a new item in the DOM as a child of the current item
    const newItem = document.createElement('div');
    newItem.setAttribute('contenteditable', 'true');
    newItem.dataset.parentId = parentId; // Set the parent ID
    newItem.dataset.action = "keydown->item#createOnEnter focusout->item#save onBlur->item#save";
    parentElement.append(newItem); // Append as a child
    newItem.focus(); // Focus on the new element
  }

  save() {
    // Logic to save the item to the server
    // Include parent_id in the JSON payload if available
    const content = this.contentTarget.textContent.trim();
    const parentId = this.contentTarget.dataset.parentId;

    if (content) {
      fetch('/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
        },
        body: JSON.stringify({ item: { title: content, parent_id: parentId || null } })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Item saved:', data)
          // Here you can handle the response, maybe clear the contenteditable if it's a new item
          // or update the item if it's an edit.
        })
        .catch(error => console.error('Error:', error))
    }
  }
}
