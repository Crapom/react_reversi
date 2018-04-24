module.exports ={
  entry: './src/Index.tsx',
  output: {
    filename: './dist/bundle.js'
  },

  devtool: 'source-map',
  resolve: {
    extensions: ['.ts','.tsx', '.js']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: 'awesome-typescript-loader'}
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
    ]
  }
};