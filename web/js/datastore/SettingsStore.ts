import {Directories} from './Directories';
import {FilePaths} from '../util/FilePaths';
import {Files} from '../util/Files';
import {Optional} from '../util/ts/Optional';
import {Settings, DefaultSettings} from './Settings';
import {Logger} from '../logger/Logger';
import {AppRuntime} from '../AppRuntime';
import {Provider, Providers} from '../util/Providers';

const log = Logger.create();

export class SettingsStore {

    private static readonly directories = new Directories();

    public static async load(): Promise<Provider<Settings>> {

        if (AppRuntime.isElectron()) {

            const settingsPath = FilePaths.create(this.directories.configDir, "settings.json");

            if (await Files.existsAsync(settingsPath)) {
                log.info("Loaded settings from: " + settingsPath);
                const data = await Files.readFileAsync(settingsPath);
                const settings = <Settings> JSON.parse(data.toString("UTF-8"));
                return Providers.of(settings);
            }

        }

        return Providers.of(new DefaultSettings());


    }

    public static async write(settings: Settings) {

        if (AppRuntime.isElectron()) {
            const settingsPath = FilePaths.create(this.directories.configDir, "settings.json");
            const data = JSON.stringify(settings, null, "  ");
            await Files.writeFileAsync(settingsPath, data);

            log.info("Wrote settings to: " + settingsPath);
        }

    }

}
