import { ConsoleOutput } from './console';
import fs from 'fs';
import path from 'path';
import { validateConfigData } from './json-schema';
import { DEPLOY_CONFIG_DATA } from '../types/config-json';

const CONFIG_FILE_NAME = 'mp-deploy.config.json';

export function checkDeployConfigFile(rootDir: string): DEPLOY_CONFIG_DATA | null {
    try {
        const data = fs.readFileSync(path.join(rootDir, CONFIG_FILE_NAME), { encoding: 'utf-8'})
        const configJson = JSON.parse(data);

        // 对配置文件做运行时校验
        const result = validateConfigData(configJson);
    
        // 校验失败，数据不符合预期
        if (!result.valid) {
            ConsoleOutput.error(result.errors.map((item) => item.toString()).join('\n'));
            return null;
        }
    
        ConsoleOutput.ok(`${CONFIG_FILE_NAME} check passed`);
        return JSON.parse(data);
    } catch (err: any) {
        ConsoleOutput.error(err.message);
        ConsoleOutput.info(`please run "mp-deploy -i" to init config file`);
        return null;
    }
}

export function writeDeployConfigFile(data: DEPLOY_CONFIG_DATA, rootDir: string) {
    fs.writeFileSync(path.join(rootDir, CONFIG_FILE_NAME), JSON.stringify(data), { encoding: 'utf-8'});
}

export function getProjectConfig(miniprogramWorkspack: string) {
    try {
        const data = fs.readFileSync(path.join(miniprogramWorkspack, 'project.config.json'), { encoding: 'utf-8' });
        return JSON.parse(data);
    } catch(e) {
        console.log(e);
        return null;
    }
    
}