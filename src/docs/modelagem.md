Employee
---------
id
name
email
createdAt
updatedAt
deletedAt

DocumentType
------------
id
name
description
createdAt
updatedAt
deletedAt

EmployeeDocument
----------------
id
employeeId
documentTypeId
status
createdAt
updatedAt
deletedAt

Document
--------
id
employeeDocumentId
createdAt
updatedAt
deletedAt

DocumentVersion
---------------
id
documentId
version
description
submittedAt
isActive
createdAt
updatedAt
deletedAt