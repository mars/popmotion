import Action from './';

class Parallel extends Action {
  constructor() {
    const { actions, ...remainingProps } = props;
    super(remainingProps);
    this.current = [];
    this.addActions(actions);
  }

  addAction(action) {
    const { actions } = this.props;

    if (actions.indexOf(action) !== -1) return;

    actions.push(action);

    const i = actions.length - 1;
    const onUpdate = (v) => this.current[i] = v;

    onUpdate(action.get());

    action
      .setProps({
        _onStop: () => this.numActiveActions--
      })
      .addListener(onUpdate);
  }

  addActions(actions) {
    actions.forEach((action) => this.addAction(action));
  }

  onStart() {
    const { actions } = this.props;
    this.numActiveActions = actions.length;
    actions.forEach((action) => action.start());
  }

  onStop() {
    const { actions } = this.props;
    actions.forEach((action) => action.stop());
  }

  getVelocity() {
    const { actions } = this.props;
    return actions.map((action) => action.getVelocity());
  }

  isActionComplete() {
    return (this.numActiveActions === 0);
  }
}

export default (actions, props) => new Parallel({ actions, ...props });
