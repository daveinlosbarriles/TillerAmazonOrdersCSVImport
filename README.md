# Tiller Amazon Orders CSV Import

This tool imports Amazon purchases from a CSV file into your Tiller Transactions sheet. It is produced by a Tiller user and is not affiliated with Tiller or Amazon.

---

## 1. What This Program Does

- Converts Amazon order data into Tiller transactions.
- Prevents duplicate imports.
- Each transaction has **[AMZ]** in front of the Amazon product name, the Amount, and whatever you specify for Account, Account #, and Account ID.
- Adds a **balancing offset entry** that is the exact negative of the total of the imported Amazon orders so you’re not double-counting expenses on your credit card.
- Sorts by date descending and filters to show just the new Amazon items.

---

## 2. How to Use It

1. Log into your Amazon account.
2. Visit [Amazon’s Request My Data portal](https://www.amazon.com/hz/privacy-central/data-requests/preview.html), select **“Your Orders”**, then **Submit Request**.
3. Wait for Amazon to notify you that the data is ready for download (this can take a few days).
4. On the sheet menu, click **Tiller Tools**, then **Amazon Orders Import**.
5. **Months lookback:** Enter how many months of Amazon transactions you want to import. For example, if you have transactions that predate when you started using Tiller, you may not want those. Or if you’ve already imported many Amazon purchases, the import will be faster if you specify only a few months instead of years.
6. Click **Choose "Order History.csv" File** and select the file you downloaded from Amazon.
7. The import will run. When it’s complete, click the **Close** button.

After the import, the Tiller Transactions sheet will be filtered by date descending and will show only your new Amazon transactions. You will also see a new **“Amazon Offset”** transaction (a positive entry); the sum of that and all the transactions you just imported will balance to zero.

**Suggestion:** Make a copy of your Tiller sheet and run the script there first to make sure it’s what you want.

To remove imported transactions later, filter the **Metadata** column by **contains** `Imported by AmazonCSVImporter`, then delete those rows.

### Top menu item

*Tiller Tools → Amazon Orders Import*

### Popup window

*The import dialog with months lookback, file picker, status log, and Close button.*

---

## 3. How to Install It

1. Open your Tiller spreadsheet.
2. In the top menu, go to **Extensions** → **Apps Script**. A new browser window opens with the code attached to your sheet.
3. Click **Code.gs** in the left sidebar. The code editor appears on the right.
4. Unless you need it, delete any default code in that window.
5. Copy the code from this repo:
   - From **Code.js** → paste into **Code.gs** (this adds the “Tiller Tools” menu).
   - Add a new script file **AmazonOrders**, paste the contents of **AmazonOrders.js** (or **amazonorders.gs**), and save as **AmazonOrders.gs**.
   - Add a new **HTML** file named **AmazonOrdersDialog**, paste the contents of **AmazonOrdersDialog.html**, and save.
6. Click the **Save project** (disk) button above the code window.
7. Go back to your Tiller sheet and **reload** it in the browser.
8. You should now see **Tiller Tools** in the menu bar.

The first time you run **Tiller Tools** → **Amazon Orders Import**, Google will ask for permissions. Approve so the script can read your CSV and write to the sheet.

---

## 4. Amazon CSV Columns Used

The importer reads these columns from your Amazon order history CSV:

- Order Date  
- Order ID  
- Product Name  
- Total Amount  
- ASIN  

---

## 5. Tiller Columns Written

The importer writes to these columns on your Transactions sheet:

| Column          | Content |
|-----------------|--------|
| **Date**        | Date of the Amazon transaction |
| **Description** | [AMZ] + Amazon product name |
| **Full Description** | Amazon Order ID, product name (ASIN) |
| **Amount**      | Amazon amount (negative for purchases) |
| **Transaction ID** | A unique ID for each row |
| **Date Added**  | Today’s date |
| **Account**     | Tiller account for the transaction. You can change the default in the code. |
| **Account #**   | Tiller account number. You can change the default in the code. |
| **Institution** | Institution name |
| **Account ID**  | Tiller account ID. You can change the default in the code. |
| **Metadata**    | `Imported by AmazonCSVImporter on <date/time>` |

---

## 6. Key Settings

You can edit the following in the code to match your sheet and Tiller account. **Safe to edit** (in **AmazonOrders.gs**): **SHEET_NAME**, and in **STATIC_VALUES** the values for **ACCOUNT**, **ACCOUNT_NUMBER**, **INSTITUTION**, and **ACCOUNT_ID**.

```javascript
// Defines expected Amazon CSV column names
const AMAZON_CONFIG = {
  COLUMNS: {
    ORDER_DATE: "Order Date",
    ORDER_ID: "Order ID",
    PRODUCT_NAME: "Product Name",
    TOTAL_AMOUNT: "Total Amount",
    ASIN: "ASIN"
  }
};

// Defines target Tiller sheet and static account values
const TILLER_CONFIG = {
  SHEET_NAME: "Transactions",   // safe to edit
  COLUMNS: {
    DATE: "Date",
    DESCRIPTION: "Description",
    AMOUNT: "Amount",
    TRANSACTION_ID: "Transaction ID",
    FULL_DESCRIPTION: "Full Description",
    DATE_ADDED: "Date Added",
    MONTH: "Month",
    WEEK: "Week",
    ACCOUNT: "Account",
    ACCOUNT_NUMBER: "Account #",
    INSTITUTION: "Institution",
    ACCOUNT_ID: "Account ID",
    METADATA: "Metadata"
  },
  STATIC_VALUES: {
    ACCOUNT: "Chase Amazon Visa",        // safe to edit
    ACCOUNT_NUMBER: "xxxx8534",          // safe to edit
    INSTITUTION: "Chase",                // safe to edit
    ACCOUNT_ID: "636838acde7b2a0033ff46d5"   // safe to edit
  }
};
```

---

## 7. How It Works (the Algorithm)

1. Reads each CSV row.
2. Converts values into Tiller format.
3. Builds a unique **Full Description** (Order ID + product + ASIN).
4. Skips rows already imported (exact match on Full Description).
5. Appends new transactions to the Transactions sheet.
6. Creates a balancing offset entry (positive amount so the sum of new rows is zero).
7. Sorts the data by Date, newest first.

### Duplicate Detection

Duplicates are prevented by **exact match on Full Description**. If the same Order ID + Product + ASIN already exists in your Transactions sheet, that row is skipped.

---

## Help

For more detail and tips: **[Amazon Orders Import Help](https://docs.google.com/document/d/1Mx38hFE2tKHGmD8hKKC9u4uFgOYyC_FcjwUH5Gops84/edit?usp=sharing)** (also linked in the import dialog).

---

## Uninstall

1. **Remove the menu:** In **Extensions** → **Apps Script**, open **Code.gs** and remove the “Amazon Orders Import” menu item and any code that calls `importAmazonCSV_LocalUpload`.
2. **Remove the script files:** Delete **AmazonOrders.gs** and **AmazonOrdersDialog.html** from the project if you no longer need them.
