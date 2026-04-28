import os, re
p = r'd:\cloud-doc-hub\backend\src\main\java\com\dochub\controller\DocumentController.java'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'(@RequestParam\(value\s*=\s*"ownerId"[^)]*\)\s*Long\s*ownerId)', '', c)
c = re.sub(r'(@RequestParam\(value\s*=\s*"userId"[^)]*\)\s*Long\s*userId)', '', c)
c = re.sub(r',\s*,', ',', c) # cleanup trailing commas
c = re.sub(r'\(\s*,', '(', c) # cleanup starting comma
c = re.sub(r',\s*\)', ')', c) # cleanup ending comma

# fix method calls
c = c.replace('uploadDocument(file, isPublic, topic, hashtags, ownerId)', 'uploadDocument(file, isPublic, topic, hashtags, null)')
c = c.replace('getTrashDocumentsByOwner(ownerId)', 'getTrashDocumentsByOwner(null)')
c = c.replace('getSharedDocuments(userId)', 'getSharedDocuments(null)')
c = c.replace('softDeleteDocument(documentId, ownerId)', 'softDeleteDocument(documentId, null)')
c = c.replace('restoreDocument(documentId, ownerId)', 'restoreDocument(documentId, null)')
c = c.replace('permanentlyDeleteDocument(documentId, ownerId)', 'permanentlyDeleteDocument(documentId, null)')
c = c.replace('removeDocumentFromSharedView(documentId, userId)', 'removeDocumentFromSharedView(documentId, null)')
c = c.replace('shareDocumentWithUser(documentId, ownerId, sharedWithUserId)', 'shareDocumentWithUser(documentId, null, sharedWithUserId)')
c = c.replace('createShareLink(documentId, ownerId)', 'createShareLink(documentId, null)')
c = c.replace('revokeShareLink(documentId, ownerId)', 'revokeShareLink(documentId, null)')
c = c.replace('updateVisibility(documentId, ownerId, isPublic)', 'updateVisibility(documentId, null, isPublic)')
c = c.replace('getPreviewUrl(documentId, userId)', 'getPreviewUrl(documentId, null)')
c = c.replace('getPreviewUrlByShareToken(shareToken, userId)', 'getPreviewUrlByShareToken(shareToken, null)')
c = c.replace('loadLocalDocumentResource(documentId, userId, shareToken)', 'loadLocalDocumentResource(documentId, null, shareToken)')

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)

print('Success')