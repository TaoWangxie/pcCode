const METHOD_NAMES = [
    "setCurrentRow",
    "toggleRowSelection",
    "toggleRowExpansion",
    "toggleAllSelection",
    "clearSelection",
    "clearFilter",
    "clearSort",
    "doLayout",
    "sort"
]

const methods = {}

METHOD_NAMES.forEach(name => {
    methods[name] = function (...args) {
        const { VtTablePlus } = this.$refs
        if (VtTablePlus && VtTablePlus[name]) {
            VtTablePlus[name](...args)
        }
    }
})

export default methods
