// CSP Base Class
class CSP {
    constructor(variables, domains, constraints) {
        this.variables = variables;
        this.domains = domains;
        this.constraints = constraints;
        this.nodesExplored = 0;
    }

    isConsistent(variable, value, assignment) {
        for (let constraint of this.constraints) {
            if (!constraint(variable, value, assignment)) {
                return false;
            }
        }
        return true;
    }

    selectUnassignedVariable(assignment) {
        // MRV Heuristic
        let unassigned = this.variables.filter(v => !(v in assignment));
        if (unassigned.length === 0) return null;

        return unassigned.reduce((minVar, v) => {
            return this.domains[v].length < this.domains[minVar].length ? v : minVar;
        });
    }

    backtrack(assignment = {}) {
        this.nodesExplored++;

        if (Object.keys(assignment).length === this.variables.length) {
            return assignment;
        }

        let variable = this.selectUnassignedVariable(assignment);
        if (!variable) return null;

        for (let value of this.domains[variable]) {
            if (this.isConsistent(variable, value, assignment)) {
                assignment[variable] = value;
                let result = this.backtrack(assignment);
                if (result !== null) return result;
                delete assignment[variable];
            }
        }
        return null;
    }

    solve() {
        this.nodesExplored = 0;
        const startTime = performance.now();
        const solution = this.backtrack();
        const endTime = performance.now();

        return {
            solution: solution,
            time: (endTime - startTime) / 1000,
            nodes: this.nodesExplored
        };
    }
}