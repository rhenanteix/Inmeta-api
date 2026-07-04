import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
@Injectable()
export class DashboardService{

    constructor(

        private prisma: PrismaService,

    ){}

    async statistics(){
        const totalDocuments = await this.prisma.employeeDocument.count()
        const completeDocuments = await this.prisma.employeeDocument.count({
            where:{
                status: "COMPLETED"
            }
        })
        

        const documentationCompletion = totalDocuments === 0 ? 0 : Number(((completeDocuments/totalDocuments)*100).toFixed(2));
        const documentsByStatus = await this.prisma.employeeDocument.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

            const pendingDocuments =
await this.prisma.employeeDocument.groupBy({

    by:['documentTypeId'],

    where:{

        status:'PENDING',

    },

    _count:true,

});
const mostPendingDocuments =
await Promise.all(

pendingDocuments.map(async(item)=>{

    const documentType =
    await this.prisma.documentType.findUnique({

        where:{

            id:item.documentTypeId,

        },

    });

    return{

        id:item.documentTypeId,

        name:documentType?.name,

        pending:item._count,

    };

})

);
mostPendingDocuments.sort(

(a,b)=>b.pending-a.pending,

);
const latestSubmissions =
await this.prisma.documentVersion.findMany({

    take:10,

    orderBy:{

        createdAt:'desc',

    },

    include:{

        document:{

            include:{

                employeeDocument:{

                    include:{

                        employee:true,

                        documentType:true,

                    },

                },

            },

        },

    },

});
const latest =
latestSubmissions.map(item=>({

    employee:

item.document.employeeDocument.employee.name,

    documentType:

item.document.employeeDocument.documentType.name,

    version:item.version,

    sentAt:item.createdAt,

}));
return{

documentationCompletion,

mostPendingDocuments,

latestSubmissions:latest,

};
    }

    async getMostPending(){
const pendingDocuments =
await this.prisma.employeeDocument.groupBy({

    by:['documentTypeId'],

    where:{

        status:'PENDING',

    },

    _count:true,

});
const mostPendingDocuments =
await Promise.all(

pendingDocuments.map(async(item)=>{

    const documentType =
    await this.prisma.documentType.findUnique({

        where:{

            id:item.documentTypeId,

        },

    });

    return{

        id:item.documentTypeId,

        name:documentType?.name,

        pending:item._count,

    };

})

);
mostPendingDocuments.sort(

(a,b)=>b.pending-a.pending,

);
return mostPendingDocuments;
    }
    async latestSubmissions() {
        const latestSubmissions =
        await this.prisma.documentVersion.findMany({

            take:10,

            orderBy:{

                createdAt:'desc',

            },

            include:{

                document:{

                    include:{

                        employeeDocument:{

                            include:{

                                employee:true,

                                documentType:true,

                            },

                        },

                    },

                },

            },

        });
        const latest =
        latestSubmissions.map(item=>({

            employee:

        item.document.employeeDocument.employee.name,

            documentType:

        item.document.employeeDocument.documentType.name,

            version:item.version,

            sentAt:item.createdAt,

        }));
        return latest;
    }
    async completion() {
    const totalDocuments =
    await this.prisma.employeeDocument.count()
    const completeDocuments =
    await this.prisma.employeeDocument.count({

        where:{

            status:"COMPLETED",

        },

    })
    
    const documentationCompletion =
    totalDocuments === 0 ? 0 : Number(((completeDocuments/totalDocuments)*100).toFixed(2));
    
    return documentationCompletion;

    }
        
    

}
