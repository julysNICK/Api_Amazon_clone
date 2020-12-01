module.exports = app =>{
    const save = (req,res) =>{
        const {existsOrError,notExistOrError,equalOrError,validationEmail} = app.api.validation
        const category = {...req.body};
        try {
           existsOrError(category.name_category,'nome não informado') 
        } catch (msg) {
            return res.status(400).send(msg)
        }
        if(category.id){
            app.db('categories')
                .update(category)
                .where({category_id: category.id})
                .then(_ => res.status(204).send())
                .catch(err => {
                    res.status(500).send(err)
                    console.log(err)
                })

        
        }else{
            app.db('categories')
                .insert(category)
                .then(_=> res.status(204).send())
                .catch(err => {
                    res.status(500).send(err)
                    console.log(err)
                })
        }
    }

    const get=(req , res) =>{
        
    }
    return {save}
}