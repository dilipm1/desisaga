import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["openIcon", "closeIcon", "mobileMenu"]

  toggleMenu() {
    this.mobileMenuTarget.classList.toggle("hidden")
    this.openIconTarget.classList.toggle("hidden")
    this.closeIconTarget.classList.toggle("hidden")
  }
}
