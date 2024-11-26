module.exports = class Command {
    constructor(cmd) {
        this.name = cmd.name;
        this.category = cmd.category;
        this.description = cmd.desc;
        this.usage = cmd.usage || this.name;
        this.example = cmd.example || null;
        this.aliases = cmd.aliases || [];
        this.perms = cmd.perms || null;
        this.run = cmd.run;
        this.options = cmd.options || null;
    }
}