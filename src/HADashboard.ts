/* eslint-disable @typescript-eslint/no-explicit-any */
import {css, CSSResult, html, LitElement, PropertyValues, TemplateResult,} from 'lit';
import {customElement, property, state} from 'lit/decorators';
import {handleAction, HomeAssistant, LovelaceCard} from 'custom-card-helpers';
import {createCard} from 'card-tools/src/lovelace-element';
import {CARD_VERSION} from './const';
import {IButtonConfig, IDashboardConfig} from './IDashboardConfig';

/* eslint no-console: 0 */
console.info(
    `%c  HA-Dashboard \n%c  Version ${CARD_VERSION}    `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
);

type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

@customElement('ha-dashboard')
export class HADashboard extends LitElement {
    @property({attribute: false}) public hass!: HomeAssistant;
    @property({attribute: false}) public lovelace?: any;
    @property({type: Boolean}) public narrow!: boolean;
    @property({type: Number}) public index?: number;
    @property({attribute: false}) public cards!: LovelaceCard[];
    @property({attribute: false}) public badges!: HTMLElement[];
    @state() protected _sidebarCard?: LovelaceCard;
    @state() protected _stickySidebarCard?: LovelaceCard;
    @state() protected _config!: IDashboardConfig;

    public static getStubConfig(): DeepPartial<IDashboardConfig> {
        return {
            cards: []
        };
    }

    public setConfig(config: IDashboardConfig): void {
        if (!config)
            throw new Error('Invalid configuration');

        this._config = config;

        if (this._config.usePanel && this.cards?.length > 1)
            throw new Error('Only one card is supported');

        const stickySidebarCard: LovelaceCard = createCard({
            type: 'vertical-stack',
            cards: config.sidebar?.stickyCards ?? []
        });
        stickySidebarCard.hass = this.hass;
        stickySidebarCard.classList.add('sticky-cards');
        this._stickySidebarCard = stickySidebarCard;

        const sidebarCard: LovelaceCard = createCard({
            type: 'vertical-stack',
            cards: config.sidebar?.cards ?? []
        });
        sidebarCard.hass = this.hass;
        sidebarCard.classList.add('scroll-panel');
        this._sidebarCard = sidebarCard;
    }

    protected shouldUpdate(changedProps: PropertyValues): boolean {
        if (!this._config)
            return false;

        return changedProps.has('hass') ||
            changedProps.has('lovelace') ||
            changedProps.has('narrow') ||
            changedProps.has('index') ||
            changedProps.has('cards') ||
            changedProps.has('badges') ||
            changedProps.has('_sidebarCard') ||
            changedProps.has('_stickySidebarCard') ||
            changedProps.has('_config');
    }

    protected updated(changedProps: PropertyValues): void {
        super.updated(changedProps);

        if (this._config.usePanel && this.cards?.length > 1)
            throw new Error('Only one card is supported');

        if (!changedProps.has('hass'))
            return;

        if (this._sidebarCard)
            this._sidebarCard.hass = this.hass;

        if (this._stickySidebarCard)
            this._stickySidebarCard.hass = this.hass;
    }

    public toggleSidebar(): void {
        const sidebar = this.shadowRoot?.querySelector('.sidebar');
        if (!sidebar)
            return;

        if (sidebar.classList.contains('show'))
            sidebar.classList.remove('show');
        else
            sidebar.classList.add('show');
    }

    protected render(): TemplateResult | void {
        return html`
            <style>
                @media (max-width: ${(this._config?.sidebar?.screenMinWidth ?? 1024) - 1}px) {
                    .sidebar {
                        display: none !important;
                    }

                    .sidebar.show {
                        display: flex !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 1000;
                        background: var(--sidebar-overlay-background, var(--sidebar-background, var(--ha-card-background, var(--card-background-color, transparent)))) !important;
                        width: var(--sidebar-overlay-width, var(--sidebar-min-width, 300px)) !important;
                    }
                }
            </style>

            <div class="dashboard">
                <ha-card class="sidebar">
                    ${this._stickySidebarCard}
                    ${this._sidebarCard}
                    <div class="sidebar-buttons">
                        ${this._config.sidebar?.buttons?.map((bConfig: IButtonConfig) => {
                            return html`
                                <div
                                        @click="${(): void =>
                                                // eslint-disable-next-line @typescript-eslint/camelcase
                                                handleAction(this, this.hass, {tap_action: bConfig.action}, 'tap')
                                        }"
                                >
                                    <ha-icon .icon=${bConfig.icon}></ha-icon>
                                </div>`
                        })}
                    </div>
                </ha-card>
                ${!this._config.usePanel ?
                        html`
                            <hui-masonry-view
                                    class="scroll-panel content-wrapper"
                                    .hass=${this.hass}
                                    .narrow=${this.narrow}
                                    .lovelace=${this.lovelace}
                                    .cards=${this.cards}
                                    .badges=${this.badges}
                                    .index=${this.index}>
                            </hui-masonry-view>` :
                        html`
                            <div class="content-wrapper">
                                ${this.cards[0]}
                            </div>`
                }
            </div>
        `;
    }

    static get styles(): CSSResult {
        return css`
          .dashboard {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 110vh;
            max-height: calc(110vh);
            overflow: hidden;
          }

          .sidebar {
            position: relative;
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: var(--sidebar-relative-width, 20%);
            overflow: hidden;
            min-width: var(--sidebar-min-width, 300px);
            max-width: var(--sidebar-max-width, 500px);
            background: var(--ha-card-background, var(--card-background-color, white));
            margin: 7px 0;
            min-height: calc(100% - 2 * 7px);
            display: flex;
            flex-direction: column;
          }

          .sidebar > * {
            --ha-card-background: transparent;
            --ha-card-box-shadow: none;
            --ha-card-border-width: 0;
            --ha-card-border-color: transparent;
            flex-grow: 1;
            flex-shrink: 1;
          }

          .sidebar .sticky-cards {
            flex-grow: 0;
            flex-shrink: 0;
          }

          .sidebar .sidebar-buttons {
            flex-grow: 0;
            flex-shrink: 0;
            position: absolute;
            bottom: 0;
            left: 0;
            padding: 0 8px 8px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: calc(100% - 16px);
          }

          .sidebar .sidebar-buttons > div:first-child {
            margin-left: 0;
          }

          .sidebar .sidebar-buttons > div {
            --mdc-icon-size: 28px;
            background: transparent;
            border-radius: 50%;
            padding: 5px;
            cursor: pointer;
            margin-left: 10px;
          }

          .content-wrapper {
            flex-shrink: 1;
            flex-grow: 1;
            flex-basis: calc(100% - var(--sidebar-relative-width, 20%));
            overflow: hidden;
            height: 100%;
          }

          .scroll-panel {
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }

          .scroll-panel::-webkit-scrollbar-track {
            box-shadow: inset 0 0 8px 8px transparent;
            border-left: solid 5px transparent;
          }

          .scroll-panel::-webkit-scrollbar {
            width: calc(3px + 5px);
          }

          .scroll-panel::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 8px 8px var(--scrollbar-thumb-color, var(--primary-color, rgb(3, 169, 244)));
            border-left: solid 5px transparent;
          }
        `;
    }
}
