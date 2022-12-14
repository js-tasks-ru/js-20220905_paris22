export default class SortableTable {
  element;
  subElements;

  constructor(
    headerConfig = [],
    data = []
  ) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  render() {
    const table = document.createElement("div");
    table.innerHTML = this.template;
    this.subElements = {
      header: table.querySelector('[data-element="header"]'),
      body: table.querySelector('[data-element="body"]'),
    };
    this.element = table.firstElementChild;
  }

  get template() {
    return `
    <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.getHeaders()}
    </div>
    <div data-element="body" class="sortable-table__body">
      ${this.getBody()}
    </div>
    </div>
    `;
  }

  sort(field, direction = "asc") {
    const cells = this.element.querySelectorAll(".sortable-table__cell[data-id]");

    for (const cell of cells) {
      cell.removeAttribute("data-order");
      if (cell.dataset.id === field) {
        cell.dataset.order = direction;
      }
    }

    const sortType = this.headerConfig.filter((header) => header.id == field)[0]
      .sortType;
    const comparator =
      sortType === "number" ? this.numbersComparator : this.stringsComparator;

    this.data.sort((row1, row2) => {
      const value1 = row1[field];
      const value2 = row2[field];
      return comparator(value1, value2) * (direction === "desc" ? -1 : 1);
    });
    this.subElements.body.innerHTML = this.getBody();
  }

  stringsComparator(a, b) {
    return a.localeCompare(b, ["ru", "en"], {caseFirst: "upper"});
  }

  numbersComparator(a, b) {
    return Number.parseFloat(a) - Number.parseFloat(b);
  }

  getHeaders() {
    return this.headerConfig
      .map((cell) => this.headerTemplate(cell))
      .join("");
  }

  getBody() {
    return this.data.map((item) => this.rowTemplate(item)).join("");
  }

  getCells(item) {
    return this.headerConfig
      .map((header) => {
        if (header.template) {
          return header.template(item[header.id]);
        } else {
          return this.cellTemplate(item[header.id]);
        }
      })
      .join("");
  }

  headerTemplate(cell) {
    return `
    <div class="sortable-table__cell" data-id="${cell.id}" data-sortable="${cell.sortable}">
        <span>${cell.title}</span>
    </div>
    `;
  }

  rowTemplate(item) {
    return `
    <a href="/products/${item.id}" class="sortable-table__row">
      ${this.getCells(item)}
    </a>
    `;
  }

  cellTemplate(value) {
    return `<div class="sortable-table__cell">${value}</div>`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
