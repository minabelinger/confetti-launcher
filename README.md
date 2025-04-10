# Confetti-Launcher

A simple and customizable confetti launcher using JavaScript and Canvas.

## Features

- **Rotations via Quaternions**: Rotations are freely customizable and efficient.
- **Shading**: Considering which direction the confetti faces, it gets lighter and darker.
- **Custom Shapes**: Use pngs, webm, svgs etc. to create custom shapes
- **High color control**: colors are only displayed according to the configuration. Make it random, make it shiny!
- **Mix it all together**: One launcher can have multiple confettis inside it, all individually configurated

## Installation

1.  **Install via NPM:**

    ```bash
    npm install confetti-launcher
    ```

2.  **Simply import the package first:**

    ```js
    import { ConfettiLauncher } from "confetti-launcher";
    ```

3.  **Create some configuration objects**

    ```js
    const confetti = {
      color: "#6beb34",
      shapeOptions: {
        type: "ellipse",
        width: "40",
        height: "40",
      },
      randomColor: true,
    };

    const launcher = {
      position: {
        x: 100,
        y: 200,
      },
      amount: [10, 10],
      strength: [100, 400],
      colors: ["#6beb34", "#4287f5", "#ca16de", "#41de16", "#de3116", "#f5d002"],
    };
    ```

4.  **Create your canvas DOM-Element**

    ```html
    <canvas id="confetti"></canvas>
    ```

    - Remember to properly adjust your canvas via css. Best cases are position: fixed, and z-index: 1

5.  **And then parse them to your Confetti-Launcher Object when everything is loaded**

    ```js
    const canvas = document.getElementById("confetti");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const conf_launcher = new ConfettiLauncher(config, launcher, [conf], canvas);
    ```

6.  **When everything works fine, it's time to shoot the launcher!**
    ```js
    conf_launcher.shoot();
    ```

## Configuration

### Overall Confetti Options

---

| Property             | Type                                     | Description                                    |
| -------------------- | ---------------------------------------- | ---------------------------------------------- |
| `velocity`           | `{x, y, maxFallspeed, gravity, airdrag}` | Movement velocity and physics settings.        |
| `quaternion`         | `{w, x, y, z}`                           | Orientation of the confetti (for 3D rotation). |
| `quaternionVelocity` | `{w, x, y, z}`                           | Rotation speed of the quaternion.              |
| `color`              | `string`                                 | Hex color of the confetti.                     |
| `randomColor`        | `boolean`                                | Whether to use random colors.                  |
| `randomRotation`     | `boolean`                                | Enable random rotation on spawn.               |
| `shading`            | `boolean`                                | Whether to apply shading to the confetti.      |
| `shapeOptions`       | `object`                                 | Options for shape rendering .                  |
| `lifetime`           | `object`                                 | Controls for lifetime behavior.                |

- #### Shape Options (`shapeOptions`)

| Property    | Type     | Description                                   |
| ----------- | -------- | --------------------------------------------- |
| `type`      | `string` | Shape type (`ellipse`, `rectangle`, `image`). |
| `width`     | `number` | Width of the shape.                           |
| `height`    | `number` | Height of the shape.                          |
| `shininess` | `number` | Reflectiveness of the surface.                |
| `shadows`   | `number` | Shadow strength.                              |
| `image`     | `object` | Defines attributes for the image              |

- #### Image Options (`shapeOptions.image`)

| Property      | Type     | Description                                                                                                                                               |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`         | `string` | Location of the image                                                                                                                                     |
| `composition` | `string` | Blending type with according colors (More on [WebMD](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)) |

- #### Lifetime Options (`lifetime`)

| Property   | Type      | Description                       |
| ---------- | --------- | --------------------------------- |
| `enabled`  | `boolean` | Whether lifetime logic is active. |
| `onset`    | `number`  | Time before the confetti appears. |
| `duration` | `number`  | How long the confetti exists.     |
| `current`  | `number`  | Current lifetime counter.         |

Remember that multiply confetti's can be configurated and saved into a launcher

---

### Launcher Options

---

| Property          | Type           | Description                                                                                                    |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------- |
| `position`        | `{x, y}`       | The Position of the launcher.                                                                                  |
| `direction`       | `{start, end}` | Angle range (in radians) to launch confetti.                                                                   |
| `confetti`        | `array`        | A list of confettis to shoot                                                                                   |
| `duration`        | `number`       | Total time (ms) the launcher will emit confetti.                                                               |
| `delay`           | `number`       | Delay (ms) before the launcher starts.                                                                         |
| `amount`          | `[min, max]`   | Range of how many confetti pieces are emitted per burst.                                                       |
| `strength`        | `[min, max]`   | Range of launch velocity for confetti.                                                                         |
| `colors`          | `array`        | Optional color palette for confetti (`hex` strings) when random colors is enabled for that according confetti. |
| `destroyDistance` | `number`       | Distance after which confetti is removed from the scene.                                                       |
| `light_dir`       | `[x, y, z]`    | Direction vector of the light source (for shading/lighting effects).                                           |

## Contributing

Feel free to contribute to the project by submitting bug reports, feature requests, or pull requests.

## Want to contact me?

You can do via [mina.belinger@gmail.com](mailto:mina.belinger@gmail.com)
