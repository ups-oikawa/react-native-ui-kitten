/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import {
  MenuItem,
  MenuItemElement,
  MenuItemProps,
} from '../menu/menuItem.component';

export type DrawerItemProps = MenuItemProps;
export type DrawerItemElement = React.ReactElement<DrawerItemProps>;

/**
 * Renders UI Kitten MenuItem component with additional styles provided by Eva.
 * Items should be rendered within Drawer or DrawerGroup children to provide a usable component.
 *
 * @extends React.Component
 *
 * @property {string | (props: TextProps) => ReactElement} title - A string or a function component
 * to render within the button.
 * If it is a function, it will be called with props provided by Eva.
 * Otherwise, renders a Text styled by Eva.
 *
 * @property {(props: ImageProps) => ReactElement} accessoryLeft - A function component
 * to render to start of the `title`.
 * Called with props provided by Eva.
 *
 * @property {(props: ImageProps) => ReactElement} accessoryRight - A function component
 * to render to end of the `title`.
 * Called with props provided by Eva.
 *
 * @property {TouchableOpacityProps} ...TouchableOpacityProps - Any props applied to TouchableOpacity component.
 */
export class DrawerItem extends React.Component<MenuItemProps> {

  public render(): MenuItemElement {
    return (
      <MenuItem {...this.props} />
    );
  }
}
