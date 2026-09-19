const tasks = [];
let idCounter = 0;

function generateId() {
    idCounter++;
    return idCounter.toString(16).padStart(24, "0");
}

function isValidId(id) {
    return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

class Task {
    constructor(data) {
        this._id = generateId();
        this.title = data.title;
        this.description = data.description || "";
        this.completed = data.completed || false;
        this.createdAt = data.createdAt || new Date();
        if (!this.title || !String(this.title).trim()) {
            const err = new Error("Task validation failed: title is required");
            err.name = "ValidationError";
            err.errors = { title: { message: "Path `title` is required." } };
            throw err;
        }
    }

    async save() {
        tasks.push(this);
        return this;
    }

    static find() {
        return Promise.resolve([...tasks]);
    }

    static findByIdAndUpdate(id, update, options) {
        if (!isValidId(id)) {
            const err = new Error("Invalid ObjectId");
            err.name = "CastError";
            return Promise.reject(err);
        }
        const index = tasks.findIndex((t) => t._id === id);
        if (index === -1) {
            return Promise.resolve(null);
        }
        const next = update || {};
        if (next.title !== undefined) {
            if (!String(next.title).trim()) {
                const err = new Error("Task validation failed: title is required");
                err.name = "ValidationError";
                err.errors = { title: { message: "Path `title` is required." } };
                return Promise.reject(err);
            }
            tasks[index].title = next.title;
        }
        if (next.description !== undefined) tasks[index].description = next.description;
        if (next.completed !== undefined) tasks[index].completed = next.completed;
        return Promise.resolve({ ...tasks[index] });
    }

    static findByIdAndDelete(id) {
        if (!isValidId(id)) {
            const err = new Error("Invalid ObjectId");
            err.name = "CastError";
            return Promise.reject(err);
        }
        const index = tasks.findIndex((t) => t._id === id);
        if (index === -1) {
            return Promise.resolve(null);
        }
        const deleted = tasks.splice(index, 1)[0];
        return Promise.resolve(deleted);
    }
}

module.exports = Task;
