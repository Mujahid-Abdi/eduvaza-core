# Deploy Opportunities Firestore Index

## Issue
Opportunities created in admin are not showing on the public page because Firestore requires a composite index for queries that use both `where` and `orderBy`.

## Solution

### Option 1: Deploy the Index (Recommended)

Run this command to deploy the Firestore indexes:

```bash
cd eduvaza-core
firebase deploy --only firestore:indexes
```

This will create the required composite index for the opportunities collection.

**Wait Time**: It may take a few minutes for the index to build. You'll see a message like:
```
✔  firestore: deployed indexes in firestore.indexes.json successfully
```

### Option 2: Use the Fallback (Temporary)

The code now includes a fallback that will work even without the index:
- It fetches all opportunities
- Filters active ones on the client side
- Sorts them by creation date

This works immediately but is less efficient for large datasets.

## Verify It's Working

1. **Create an opportunity** in `/admin/opportunities`
   - Make sure "Active" is checked
   - Click "Create Opportunity"

2. **Check the admin page**
   - You should see it in the table
   - Status should show "Active"

3. **Visit the public page** at `/opportunities`
   - Your opportunity should appear
   - If not, check browser console for errors

## Troubleshooting

### "Index not found" error in console
- The fallback will handle this automatically
- Deploy the index using Option 1 above

### Opportunity still not showing
1. **Check if it's active**:
   - Go to `/admin/opportunities`
   - Look at the Status column
   - Should say "Active" not "Inactive"

2. **Check browser console**:
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Check Firestore directly**:
   - Go to Firebase Console
   - Navigate to Firestore Database
   - Look for `opportunities` collection
   - Verify the document has `isActive: true`

4. **Check Firestore rules**:
   - Make sure rules are deployed:
   ```bash
   firebase deploy --only firestore:rules
   ```

### "Permission denied" error
- Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

## Complete Deployment

To deploy everything at once:

```bash
cd eduvaza-core
firebase deploy --only firestore
```

This deploys both rules and indexes.

## Index Details

The index being created:
- **Collection**: opportunities
- **Fields**:
  - isActive (Ascending)
  - createdAt (Descending)

This allows efficient queries like:
```javascript
where('isActive', '==', true)
orderBy('createdAt', 'desc')
```

## After Deployment

Once the index is deployed:
1. Opportunities will load faster
2. No more fallback warnings in console
3. Better performance with many opportunities

The fallback code will remain in place as a safety net.
