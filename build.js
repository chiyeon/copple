const fs = require("fs")

const data = require("./src/data.json")

/**
 * Prints formatted message to console
 * @param {String} message Message to put to console
 */
const print = (message) => {
    let now = new Date()
    console.log(`[${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]: ${message}`)
 }

/* given a path to an html 'template' and data of props, loads in the template + props and returns as a string */
const load_template = async (template_path, props) => {
    let template_html = eval("`" + (await fs.readFileSync(template_path)) + "`")
    return template_html
}

/* loads templates for each element in an array, passing the nth array element as a prop. optional callfirst async function, which is called BEFORE loading 
 * the template in case any changes need to be made. this can be used to nest from_array calls for example */
const load_template_from_array = async (src_array, template_path, callfirst) => {
    let output = ""

    if (callfirst == undefined) callfirst = async (src) => { return src }

    for (let src of src_array)
    {
        let _src = await callfirst(src)

        output += await load_template(template_path, _src)
        output += "\n"
    }

    return output
}

const build_index = async (site) => {
    print("Building index")
    let new_index_html = await load_template("public/index.html", { site })
    await fs.writeFileSync("build/index.html", new_index_html)

    print("Copying stylesheets")
    await fs.copyFileSync("public/style.css", "build/style.css")

    print("Done! Output written to build/")
}

/* 
 * project-specific build functions
 */
const build_about = async () => {
    print("\tBuilding about")
    return await load_template("src/about.html", {
        links: await load_template_from_array(data.about.links, "src/link.html"),
        about: data.about.description
    })
}

const build_projects = async () => {
    print("\tBuilding projects directory")
    return await load_template("src/directory.html", {
        projects: await load_template_from_array(data.projects, "src/project.html", async (project) => {
            let links = await load_template_from_array(project.links, "src/link.html")
            return {...project, links}
        })
    })
}

(async () => {
    print("Compiling project")
    let site = ""

    site += await build_about()
    site += await build_projects()

    let final_html = await load_template("src/site.html", { site })

    await build_index(final_html)
})()