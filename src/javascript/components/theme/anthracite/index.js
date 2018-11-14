import {createMuiTheme} from '@material-ui/core';
import {commonBaseThemeConfig} from "../common-base/config";
import * as _ from 'lodash';

import {shape} from "./shape";
import {typography} from "./typography";
// Overrides
import {anthraciteAppBar} from "./overrides/appbar";
import {anthraciteButton, anthraciteButtonBase, anthraciteIconButton} from "./overrides/button";
import {anthraciteCard, anthraciteCardContent, anthraciteCardHeader} from "./overrides/card"
import {anthraciteDialog, anthraciteDialogActions, anthraciteDialogTitle, anthraciteDialogContent} from "./overrides/dialog";
import {anthraciteCheckbox} from "./overrides/checkbox";
import {anthraciteInput} from "./overrides/input";
import {anthraciteMenu, anthraciteMenuItem} from "./overrides/menu";
import {anthracitePaper} from "./overrides/paper";
import {anthraciteSelect} from "./overrides/select";
import {anthraciteTable, anthraciteTableCell, anthraciteTableRow, anthraciteTablePagination} from "./overrides/table";
import {anthraciteTab, anthraciteTabs} from "./overrides/tabs";
import {anthraciteToolBar} from "./overrides/toolbar";
import {anthraciteListItem, anthraciteListItemSecondaryAction, anthraciteListItemText, anthraciteListSubheader,
    anthraciteListItemIcon} from "./overrides/list";
import {anthraciteTypography} from "./overrides/typography";
import {anthraciteFormControlLabel, anthraciteFormLabel} from "./overrides/form";
import {anthracitePanel, anthracitePanelActions, anthracitePanelDetails} from "./overrides/panel";
import {anthraciteChip} from "./overrides/chip";

// Import of Light Anthracite palette
import {anthraciteLightPalette} from "./light/palette";

// Import of Dark Anthracite palette
import {anthraciteDarkPalette} from "./dark/palette";
import {anthracitePalette } from './overrides/palette.js'


const anthraciteLightThemeConfig = {
    palette: anthraciteLightPalette,
    shape,
    typography
};

const anthraciteLightThemeOverrides = (theme) => ({
    MuiAppBar: anthraciteAppBar(theme),
    MuiButton: anthraciteButton(theme),
    MuiButtonBase: anthraciteButtonBase(theme),
    MuiIconButton: anthraciteIconButton(theme),
    MuiCard: anthraciteCard(theme),
    MuiCardContent: anthraciteCardContent(theme),
    MuiCardHeader: anthraciteCardHeader(theme),
    MuiCheckbox: anthraciteCheckbox(theme),
    MuiChip: anthraciteChip(theme),
    MuiDialogTitle: anthraciteDialogTitle(theme),
    MuiDialog: anthraciteDialog(theme),
    MuiDialogActions: anthraciteDialogActions(theme),
    MuiDialogContent: anthraciteDialogContent(theme),
    MuiFormLabel: anthraciteFormLabel(theme),
    MuiFormControlLabel: anthraciteFormControlLabel(theme),
    MuiInput: anthraciteInput(theme),
    MuiListItem: anthraciteListItem(theme),
    MuiListItemSecondaryAction: anthraciteListItemSecondaryAction,
    MuiListSubheader: anthraciteListSubheader,
    MuiListItemText: anthraciteListItemText,
    MuiMenu: anthraciteMenu(theme),
    MuiMenuItem: anthraciteMenuItem(theme),
    MuiExpansionPanel: anthracitePanel(theme),
    MuiExpansionPanelDetails: anthracitePanelDetails,
    MuiExpansionPanelActions: anthracitePanelActions(theme),
    MuiPaper: anthracitePaper(theme),
    MuiSelect: anthraciteSelect(theme),
    MuiTable: anthraciteTable(theme),
    MuiTableRow: anthraciteTableRow(theme),
    MuiTablePagination: anthraciteTablePagination(theme),
    MuiTableCell: anthraciteTableCell(theme),
    MuiTab: anthraciteTab(theme),
    MuiTabs: anthraciteTabs(theme),
    MuiToolbar: anthraciteToolBar(theme),
    MuiTypography: anthraciteTypography(theme)
});

const anthraciteLightTheme = createMuiTheme(_.merge({}, commonBaseThemeConfig, anthraciteLightThemeConfig));
_.merge(anthraciteLightTheme, {overrides: anthraciteLightThemeOverrides(anthraciteLightTheme)});

const anthraciteDarkThemeConfig = {
    palette: anthracitePalette,
    shape,
    typography
};

const anthraciteDarkThemeOverrides = (theme) => ({
    MuiAppBar: anthraciteAppBar(theme),
    MuiButton: anthraciteButton(theme),
    MuiButtonBase: anthraciteButtonBase(theme),
    MuiIconButton: anthraciteIconButton(theme),
    MuiCard: anthraciteCard(theme),
    MuiCardContent: anthraciteCardContent(theme),
    MuiCardHeader: anthraciteCardHeader(theme),
    MuiCheckbox: anthraciteCheckbox(theme),
    MuiChip: anthraciteChip(theme),
    MuiDialogTitle: anthraciteDialogTitle(theme),
    MuiDialog: anthraciteDialog(theme),
    MuiDialogActions: anthraciteDialogActions(theme),
    MuiDialogContent: anthraciteDialogContent(theme),
    MuiFormLabel: anthraciteFormLabel(theme),
    MuiFormControlLabel: anthraciteFormControlLabel(theme),
    MuiInput: anthraciteInput(theme),
    MuiListItem: anthraciteListItem(theme),
    MuiListItemIcon: anthraciteListItemIcon,
    MuiListItemSecondaryAction: anthraciteListItemSecondaryAction,
    MuiListSubheader: anthraciteListSubheader,
    MuiListItemText: anthraciteListItemText,
    MuiMenu: anthraciteMenu(theme),
    MuiMenuItem: anthraciteMenuItem(theme),
    MuiExpansionPanel: anthracitePanel(theme),
    MuiExpansionPanelDetails: anthracitePanelDetails,
    MuiExpansionPanelActions: anthracitePanelActions(theme),
    MuiPaper: anthracitePaper(theme),
    MuiSelect: anthraciteSelect(theme),
    MuiTable: anthraciteTable(theme),
    MuiTableRow: anthraciteTableRow(theme),
    MuiTableCell: anthraciteTableCell(theme),
    MuiTab: anthraciteTab(theme),
    MuiTabs: anthraciteTabs(theme),
    MuiToolbar: anthraciteToolBar(theme),
    MuiTypography: anthraciteTypography(theme)
});

const anthraciteDarkTheme = createMuiTheme(_.merge({}, commonBaseThemeConfig, anthraciteDarkThemeConfig));
_.merge(anthraciteDarkTheme, {overrides: anthraciteDarkThemeOverrides(anthraciteDarkTheme)});

export {anthraciteLightTheme, anthraciteDarkTheme}
