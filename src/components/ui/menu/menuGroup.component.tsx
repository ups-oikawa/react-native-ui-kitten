import React from 'react';
import {
  Animated,
  ImageProps,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {
  ChildrenWithProps,
  Frame,
  MeasureElement,
  MeasuringElement,
  Point,
} from '../../devsupport';
import { ChevronDown } from '../shared/chevronDown.component';
import {
  MenuItem,
  MenuItemElement,
  MenuItemProps,
} from './menuItem.component';

export interface MenuGroupProps extends MenuItemProps {
  children?: ChildrenWithProps<MenuItemProps>;
}

export type MenuGroupElement = React.ReactElement<MenuGroupProps>;

interface State {
  submenuHeight: number;
}

const CHEVRON_DEG_COLLAPSED: number = -180;
const CHEVRON_DEG_EXPANDED: number = 0;
const CHEVRON_ANIM_DURATION: number = 200;
const POSITION_OUTSCREEN: Point = Point.outscreen();

/**
 * Renders a group of items displayed in Menu.
 * Groups should be rendered within Menu children to provide a usable component.
 *
 * @extends React.Component
 *
 * @property {ReactElement<MenuItemProps> | ReactElement<MenuItemProps>[]} children -
 * items to be rendered within group.
 *
 * @property {string | (props: TextProps) => ReactElement} title - A string or a function component
 * to render within the group.
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
export class MenuGroup extends React.Component<MenuGroupProps, State> {

  private expandAnimation: Animated.Value = new Animated.Value(0);

  public state: State = {
    submenuHeight: 1,
  };

  private get hasSubmenu(): boolean {
    return React.Children.count(this.props.children) > 0;
  }

  private get shouldMeasureSubmenu(): boolean {
    return this.state.submenuHeight === 1;
  }

  private get expandAnimationValue(): number {
    // @ts-ignore - private api, but let's us avoid creating animation listeners.
    // `this.expandAnimation.addListener`
    return this.expandAnimation._value;
  }

  private get expandToRotateInterpolation(): Animated.AnimatedInterpolation {
    return this.expandAnimation.interpolate({
      inputRange: [-this.state.submenuHeight, CHEVRON_DEG_EXPANDED],
      outputRange: [`${CHEVRON_DEG_COLLAPSED}deg`, `${CHEVRON_DEG_EXPANDED}deg`],
    });
  }

  private get submenuStyle(): ViewStyle {
    // @ts-ignore - issue of `@types/react-native` package
    return this.shouldMeasureSubmenu ? styles.outscreen : { height: this.expandAnimation };
  }

  private get defaultItemProps(): MenuItemProps {
    return { appearance: 'grouped' };
  }

  private onPress = (): void => {
    if (this.hasSubmenu) {
      const expandValue: number = this.expandAnimationValue > 0 ? 0 : this.state.submenuHeight;
      this.createExpandAnimation(expandValue).start();
    }
  };


  private onSubmenuMeasure = (frame: Frame): void => {
    this.setState({ submenuHeight: frame.size.height });
  };

  private createExpandAnimation = (toValue: number): Animated.CompositeAnimation => {
    return Animated.timing(this.expandAnimation, {
      toValue: toValue,
      duration: CHEVRON_ANIM_DURATION,
    });
  };

  private renderAccessoryIfNeeded = (evaProps: Partial<ImageProps>): React.ReactElement => {
    if (!this.hasSubmenu) {
      return null;
    }

    const style = StyleSheet.flatten(evaProps.style);

    return (
      <Animated.View style={{ transform: [{ rotate: this.expandToRotateInterpolation }] }}>
        <ChevronDown {...evaProps} fill={style.tintColor}/>
      </Animated.View>
    );
  };

  private renderItemsWithDefaultProps = (): React.ReactNode => {
    return React.Children.map(this.props.children, (item: MenuItemElement): MenuItemElement => {
      return React.cloneElement(item, this.defaultItemProps, null);
    });
  };

  private renderGroupedItems = (evaStyle): React.ReactElement<ViewProps> => {
    return (
      <Animated.View style={[styles.submenu, this.submenuStyle, evaStyle]}>
        {this.renderItemsWithDefaultProps()}
      </Animated.View>
    );
  };

  private renderMeasuringGroupedItems = (evaStyle): MeasuringElement => {
    return (
      <MeasureElement onMeasure={this.onSubmenuMeasure}>
        {this.renderGroupedItems(evaStyle)}
      </MeasureElement>
    );
  };

  private renderGroupedItemsIfNeeded = (evaStyle): React.ReactNode => {
    if (!this.hasSubmenu) {
      return null;
    }

    if (this.shouldMeasureSubmenu) {
      return this.renderMeasuringGroupedItems(evaStyle);
    }

    return this.renderGroupedItems(evaStyle);
  };

  public render(): React.ReactNode {
    const { children, ...itemProps } = this.props;

    return (
      <React.Fragment>
        <MenuItem
          accessoryRight={this.renderAccessoryIfNeeded}
          {...itemProps}
          onPress={this.onPress}
        />
        {this.renderGroupedItemsIfNeeded({})}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  outscreen: {
    position: 'absolute',
    left: POSITION_OUTSCREEN.x,
    top: POSITION_OUTSCREEN.y,
  },
  submenu: {
    overflow: 'hidden',
  },
});
