

export const fileFilter = ( req: Express.Request, file: Express.Multer.File,callback: (error: Error | null, acceptFile: boolean) => void ) => {
    if( !file ) return callback( new Error('No se encontro archivo'), false);

    const fileExtension = file.mimetype.split('/')[1] || '';
    const validationExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp' ];

    if(validationExtensions.includes(fileExtension)){
       return callback( null, true);
    }
    callback(null, false);
} 