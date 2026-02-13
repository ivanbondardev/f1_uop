/**
 * UIUX PoC — Mock data render helpers
 * Renders UI from JSON mock objects. No API calls.
 */

(function () {
  "use strict";

  window.MockRender = {
    /**
     * Get JSON from script tag by id
     * @param {string} id - id of script[type="application/json"]
     * @returns {object}
     */
    getMock: function (id) {
      var el = document.getElementById(id);
      if (!el) return {};
      try {
        return JSON.parse(el.textContent);
      } catch (e) {
        return { meta: { source: "dummy", error: "parse" }, data: {}, errors: [String(e)] };
      }
    },

    /**
     * Render table from data.items
     * @param {HTMLElement} container
     * @param {object} mock - { meta, data: { items: [...] } }
     * @param {string[]} columns - column keys
     */
    renderTable: function (container, mock, columns) {
      if (!container || !mock || !mock.data) return;
      var items = mock.data.items || [];
      var cols = columns || (items[0] ? Object.keys(items[0]) : []);
      var html =
        "<table><thead><tr>" +
        cols.map(function (c) {
          return "<th>" + escapeHtml(String(c)) + "</th>";
        }).join("") +
        "</tr></thead><tbody>";
      items.forEach(function (row) {
        html += "<tr>";
        cols.forEach(function (c) {
          html += "<td>" + escapeHtml(String(row[c] != null ? row[c] : "")) + "</td>";
        });
        html += "</tr>";
      });
      html += "</tbody></table>";
      container.innerHTML = html;
    },

    /**
     * Render list items from data.items
     */
    renderList: function (container, mock, itemKey) {
      if (!container || !mock || !mock.data) return;
      var items = mock.data.items || [];
      var key = itemKey || "label";
      container.innerHTML = items
        .map(function (it) {
          var val = typeof it === "object" ? (it[key] != null ? it[key] : it.id) : it;
          return '<li>' + escapeHtml(String(val)) + '</li>';
        })
        .join("");
    },

    /**
     * Set text content from mock path
     */
    setText: function (el, mock, path) {
      if (!el || !mock) return;
      var keys = path.split(".");
      var val = mock;
      for (var i = 0; i < keys.length && val != null; i++) val = val[keys[i]];
      el.textContent = val != null ? String(val) : "";
    }
  };

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }
})();
