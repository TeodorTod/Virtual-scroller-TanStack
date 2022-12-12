import React from 'react'
import ReactDOM from 'react-dom'

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SearchIcon from '@mui/icons-material/Search';

import './index.css'

import {
  elementScroll,
  useVirtualizer,
  VirtualizerOptions,
} from '@tanstack/react-virtual'
import { accordionSummaryClasses } from '@mui/material';



function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}

function App() {

  //start of MUI
  const [expanded, setExpanded] = React.useState(false);
  const [dogs, setDogs] = React.useState<any[]>([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //end of MUI

  const fetchData = () => {
    fetch('https://dog.ceo/api/breed/hound/images')
      .then((res) => res.json())
      .then((data) => {
        setDogs(data.message)
      })
  }



  console.log(dogs);



  React.useEffect(() => {
    fetchData();

  }, [])



  const parentRef = React.useRef<HTMLDivElement>()
  const scrollingRef = React.useRef<number>()

  const scrollToFn: VirtualizerOptions<any, any>['scrollToFn'] =
    React.useCallback((offset, canSmooth, instance) => {
      const duration = 1000
      const start = parentRef.current.scrollTop
      const startTime = (scrollingRef.current = Date.now())

      const run = () => {
        if (scrollingRef.current !== startTime) return
        const now = Date.now()
        const elapsed = now - startTime
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
        const interpolated = start + (offset - start) * progress

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance)
          requestAnimationFrame(run)
        } else {
          elementScroll(interpolated, canSmooth, instance)
        }
      }

      requestAnimationFrame(run)
    }, [])

  const rowVirtualizer = useVirtualizer({
    count: 50,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 675,
    overscan: 5,
    scrollToFn,
  })

  const randomIndex = Math.floor(Math.random() * 50)

  return (
    <div className="main">
      {/* <p>
        This smooth scroll example uses the <code>`scrollToFn`</code> to
        implement a custom scrolling function for the methods like{' '}
        <code>`scrollToIndex`</code> and <code>`scrollToOffset`</code>
      </p> */}

      {/* <button className='random' onClick={() => rowVirtualizer.scrollToIndex(randomIndex)}>
        
      </button> */}
      <div className='random'>
        <Button onClick={() => rowVirtualizer.scrollToIndex(randomIndex)} variant="contained" startIcon={<SearchIcon />}>
          View random dog
        </Button>
      </div>


      <div
        ref={parentRef}
        className="List"
        style={{
          height: `655px`,
          width: `700px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >

              <Card sx={{ maxWidth: 700 }}>
                <CardHeader className='user'
                  avatar={
                    <Avatar alt="Travis Howard" src={dogs[virtualRow.index + 1]} />
                  }

                  title={<h3 style={{ fontSize: "16px" }}>Michael Jordan</h3>}

                />
                <div>
                  <img className='image' src={dogs[virtualRow.index]} alt="" />
                  {/* {dogs.length > 0 &&
                    dogs.map((dog, index) =>
                      <div key={index}>
                        <img className='image' src={dog.message} alt="" />
                      </div>
                    )
                  } */}
                </div>
                <CardContent>
                  <h3 >
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                  </h3>
                </CardContent>
                <CardActions className='action' disableSpacing>
                  <Button variant="outlined" startIcon={<ThumbUpIcon />}>
                    Like
                  </Button>
                  <IconButton color="primary">
                    <FavoriteIcon /> Total Likes: {virtualRow.index}
                  </IconButton>

                </CardActions>

              </Card>


            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)
