const AuthorsServices = require('../services/authors.services');

module.exports = () => {
    return (req, res, next) => {
        try {
            let { 
                per_page = 5, 
                page = 1, 
                order = "id", 
                sort ="desc" 
            } = req.query;
    
            if (order !== "id" && order !== "name") throw new Error('Order needs to be id or name.')
            if (sort !== "asc" && sort !== "desc") throw new Error('Sort needs to be ASC or DESC.')
            if (per_page < 1) throw new Error('Per page must be value between 1 or more.')
            
            if (parseInt(page) === 0) page = 1;
    
            const authorsServices = new AuthorsServices();
            const authors = authorsServices.getList(parseInt(page), order, sort, parseInt(per_page));
    
            const totalPage = Math.ceil(authors.total/per_page);
    
            let result ={
                page: parseInt(page),
                nextPage: (totalPage > page) ? parseInt(page) + 1 : null,
                totalPage,
                ...authors
            }
    
            res.paginated = result;
            next();
        } catch (error) {
            res.status(500).send(error.message);    
            next();
        }
    }
}