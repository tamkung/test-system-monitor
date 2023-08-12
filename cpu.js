var os = require("os");
module.exports = {
    cpuAverage: function cpuAverage() {
        var totalIdle = 0, totalTick = 0;
        var cpus = os.cpus();
        for (var i = 0, len = cpus.length; i < len; i++) {
            var cpu = cpus[i];
            for (type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        }
        return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
    }
}