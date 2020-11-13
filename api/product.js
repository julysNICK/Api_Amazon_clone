module.exports = app => {
    const {existsOrError,notExistOrError,equalOrError} = app.api.validation
  const save = (req,res) => {
      const product = {...req.body}
      if(req.params.id) product.id = req.params.id;
      try {
          existsOrError(product.title,'nome do produto vazio')
          existsOrError(product.imageUrl,'Imagem do produto obrigatorio')
          existsOrError(product.userId,'loja ou vendedor nâo informado')
          existsOrError(product.price,'valor nâo informado')
          existsOrError(product.categoryId,'categoria nâo informada')
      } catch (msg) {
          res.status(400).send(msg)
      }
      if (product.id) {
          app.db('products')
              .update(product)
              .where({id: product.id})
              .then(_=>res.status(204).send())
              .catch(err => res.status(500).send(err))
      } else {
          app.db('products')
                .insert(product)
                .then(_=>res.status(204).send())
                .catch(err => res.status(500).send(err))

      }
  }
      const remove = async (req,res) => {
         try {
             const rowsDelete = await app.db('products')
                                            .where({id: req.params.id}).del()
             try {
                 existsOrError(rowsDelete,'artigo nao encontrado')
             } catch (msg) {
                 return res.status(400).send(msg)
             }
             res.status(204).send()
         } catch (msg) {
             res.status(400).send(msg)
         } 
      }

      const limit = 10
       const getPagination = async (req, res) => {
           const page = req.query.page || 1
        
           const result = await app.db('products').count('id').first()
           const count = parseInt(result.count)

           app.db('products')
                .select('id','title','imageUrl','price','userId','categoryId')
                .limit(limit).offset(page * limit - limit)
                .then(products => res.json({data: products , count ,limit}))
                .catch(err => res.status(500).send(err))
       }
       


    const getById = (req,res)=>{
        const { id } = req.params
        app.db('products')
            .where({ id })
            .first()
            .then((products) =>{
                products.title = products.title.toString()
                return res.json(products)
            })
            .catch((err) => res.status(500).send(err));
    }
  
  return { save,remove,getById,getPagination }
}