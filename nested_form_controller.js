import { Controller } from "@hotwired/stimulus";

/**
 * RailsNestedForm Controller
 * Handles adding and removing nested form fields in a Rails application.
 * It listens for events to add new records or sub-records and to remove existing ones.
 * It also manages the confirmation dialog for removal actions.
 *
 * Usage:
 * - Add data-controller="rails-nested-form" to the element that contains the nested form.
 * - Add data-target="rails-nested-form.target" to the element where new records should be added.
 * - Add data-target="rails-nested-form.template" to the template element containing the HTML for new records.
 * - Use data-action="click->rails-nested-form#add" to trigger adding a new record.
 * - Use data-action="click->rails-nested-form#addSubRecord" to trigger adding a new sub-record.
 * - Use data-action="click->rails-nested-form#remove" to trigger removing a record.
 * - Optionally, use turbo-confirm attribute on the remove button to show a confirmation dialog.
 */
export default class RailsNestedForm extends Controller {
  static targets = ["target", "template"];
  static values = {
    wrapperSelector: {
      type: String,
      default: ".nested-form-wrapper",
    },
  };

  add(e) {
    e.preventDefault();

    const content = this.templateTarget.innerHTML.replace(
      /NEW_RECORD/g,
      new Date().getTime().toString(),
    );
    this.targetTarget.insertAdjacentHTML("beforeend", content);

    const event = new CustomEvent("rails-nested-form:add", { bubbles: true });
    this.element.dispatchEvent(event);
  }

  addSubRecord(e) {
    e.preventDefault();

    const content = this.templateTarget.innerHTML.replace(
      /NEW_SUB_RECORD/g,
      new Date().getTime().toString(),
    );
    this.targetTarget.insertAdjacentHTML("beforeend", content);

    const event = new CustomEvent("rails-nested-form:add", { bubbles: true });
    this.element.dispatchEvent(event);
  }

  remove(e) {
    // Check if the element has turbo-confirm and handle confirmation
    const confirmMessage = e.target.getAttribute("turbo-confirm");
    if (confirmMessage && !confirm(confirmMessage)) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    const wrapper = e.target.closest(this.wrapperSelectorValue);

    if (wrapper.dataset.newRecord === "true") {
      wrapper.remove();
    } else {
      wrapper.style.display = "none";

      const input = wrapper.querySelector("input[name*='_destroy']");
      input.value = "1";
    }

    const event = new CustomEvent("rails-nested-form:remove", {
      bubbles: true,
    });
    this.element.dispatchEvent(event);
  }
}
