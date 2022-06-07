/*
https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
https://ocdla--ocdpartial--clickpdxorder.visualforce.com/apex/OrderEntry?test=true&id=8015b00000R4AGK

<table>
    <tr><th>Country</th><th>Date</th><th>Size</th></tr>
    <tr><td>France</td><td>2001-01-01</td><td><i>25</i></td></tr>
    <tr><td><a href=#>spain</a></td><td><i>2005-05-05</i></td><td></td></tr>
    <tr><td><b>Lebanon</b></td><td><a href=#>2002-02-02</a></td><td><b>-17</b></td></tr>
    <tr><td><i>Argentina</i></td><td>2005-04-04</td><td><a href=#>100</a></td></tr>
    <tr><td>USA</td><td></td><td>-6</td></tr>
</table>
*/

const Table = (function() {


    let SORT_ASC = true;

    let labels = 'li.cell-label';
    
    let contain = ".order-table";
    
    let previousQuerySelectorAll = 'ul:nth-child(n+2)';
    
    let rowQuery = 'ul';
    
    let root;


    let ORDER_NO_CHANGE =   ()=>0; // function(a,b) { return 0; };





    function setupRows() {

        let mechanism = document.querySelectorAll(".cell-label a");
        mechanism.forEach(function(label) {
            label.addEventListener("click",rowHandler);
        });
        
        console.log("Sorting is set up.");
    }


    function orderRows(rows, comparator) {
        
        return !comparator ? rows.reverse() : rows.sort(comparator);
    }


    function updateView(rows, container) {

        rows.forEach(row => container.appendChild(row));
    }



    function test() {
        let container = document.querySelector(".order-table");
        let rows = Array.from(container.querySelectorAll(rowQuery));
        let labels = rows.shift(); // Remove the header row.
        let index = 2; // Index of column to sort by. Corresponds to name.
        let sortColumn = labels.children[index];
        
        let comparator = getComparator(index, SORT_ASC = !SORT_ASC);
        let reorder = orderRows(rows, comparator);
        
        updateView(reorder, container);
    }



    const getValue = (row, n) => row.children[n].children[0].value || row.children[n].children[0].value;

    // Returns a function responsible for sorting a specific column index 
    // (idx = columnIndex, asc = ascending order?).
    const getComparator = function(idx, asc) { 

        // This is used by the array.sort() function...
        return function(a, b) { 

            // This is a transient function, that is called straight away. 
            // It allows passing in different order of args, based on 
            // the ascending/descending order.
            return function(v1, v2) {

                // Sort based on a numeric or localeCompare, based on type...
                return (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) 
                    ? v1 - v2 
                    : v1.toString().localeCompare(v2);
            }(getValue(asc ? a : b, idx), getValue(asc ? b : a, idx));
        }
    };


    function rowHandler(e) {
        console.log("Entering rowHandler");
        e.stopPropagation();
        e.preventDefault();

        let label = e.target;
        let container = label.closest(contain);
        let labels = label.closest("ul.row").querySelectorAll("li.cell");

        
        let rows = Array.from(container.querySelectorAll(rowQuery));

        let index = null;

        let fn = function(node, i) {
            if(node.contains(label)) {
                index = i;
            }
        };


        console.log(label);
        
        labels.forEach(fn);
        console.log(index);
        let comparator = getComparator(++index, SORT_ASC = !SORT_ASC);

        rows.shift(); // Remove the header row.
        rows = orderRows(rows, comparator);

        updateView(rows, container);
        return false;
    }

    let proto = {

    };


    function table(selector) {
        this.root = document.querySelector(selector);
        setupRows();
    }

    table.prototype = proto;

    return table;
})();


export default Table;